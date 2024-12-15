const express = require('express');
const {hash} = require("bcrypt");
const {verifyToken} = require("../middleware/auth");
const router = express.Router();

module.exports = (pool) => {

    // GET stocks that the user currently owns
    router.get("/investment", verifyToken, async (req, res) => {
        try {
            const {user_id} = req.user;

            const result = await pool.query(
                `
                    WITH latest_price AS (
                        SELECT
                            e.ticker,
                            e.date AS last_price_date,
                            e.open AS last_price
                        FROM equities e
                        WHERE (e.ticker, e.date) IN (
                            SELECT ticker, MAX(date)
                            FROM equities
                            GROUP BY ticker
                        )
                    )
                    SELECT
                        i.user_id, i.ticker, i.amount, i.purchase_date, e.open AS purchase_price, eq.name AS equity_name, lp.last_price, e.industry
                    FROM investment i
                        JOIN equities e
                            ON i.ticker = e.ticker AND i.purchase_date = e.date
                        JOIN latest_price lp
                            ON i.ticker = lp.ticker
                        JOIN equities eq
                            ON i.ticker = eq.ticker AND eq.date = lp.last_price_date
                    WHERE i.user_id = $1;
                `,
                [user_id]
            )

            res.json({
                investments: result.rows
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching user details"});
        }
    })

    router.get("/industry-distribution", verifyToken, async (req, res) => {
        try {
            const { user_id } = req.user;

            const query = `
            WITH latest_prices AS (
                SELECT 
                    e.ticker,
                    e.close AS recent_close,
                    e.industry,
                    ROW_NUMBER() OVER (PARTITION BY e.ticker ORDER BY e.date DESC) AS rn
                FROM 
                    equities e
            ),
            user_investments AS (
                SELECT 
                    i.ticker,
                    i.amount,
                    lp.industry,
                    lp.recent_close
                FROM 
                    investment i
                    JOIN latest_prices lp ON i.ticker = lp.ticker
                WHERE 
                    i.user_id = $1
                    AND lp.rn = 1
            ),
            industry_totals AS (
                SELECT 
                    industry,
                    SUM(amount * recent_close) AS total_value
                FROM 
                    user_investments
                GROUP BY 
                    industry
            ),
            ranked_industries AS (
                SELECT 
                    industry,
                    total_value,
                    RANK() OVER (ORDER BY total_value DESC) AS rank
                FROM 
                    industry_totals
            ),
            grouped_industries AS (
                SELECT 
                    CASE 
                        WHEN rank <= 3 THEN industry 
                        ELSE 'Other' 
                    END AS industry_group,
                    total_value
                FROM 
                    ranked_industries
            )
            SELECT 
                industry_group AS industry,
                SUM(total_value) AS amount
            FROM 
                grouped_industries
            GROUP BY 
                industry_group
            ORDER BY 
                SUM(total_value) DESC;
        `;

            const result = await pool.query(query, [user_id]);

            const totalInvestment = result.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

            const response = {
                total: totalInvestment,
                industryBreakDown: result.rows.map(row => ({
                    industry: row.industry,
                    percentage: `${((parseFloat(row.amount) / totalInvestment) * 100).toFixed(2)}%`,
                    monetaryValue: parseFloat(row.amount)
                }))
            };

            res.json(response);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching industry breakdown" });
        }
    });

    router.get("/portfolioHistory", verifyToken, async (req, res) => {
        try {
            const { timePeriod } = req.query;
            const validPeriods = ["1D", "1W", "1M", "1Y", "5Y"];

            if (!validPeriods.includes(timePeriod)) {
                return res.status(400).json({ error: "Invalid time period. Use one of [1W, 1M, 1Y, 5Y]." });
            }

            const user_id = req.user.user_id;

            const query = `
        WITH t AS (
            SELECT 
                CURRENT_DATE - (n * $1::interval) AS period_date,
                n
            FROM generate_series(0, 8) AS n
        ),
        latest_prices_per_period AS (
            SELECT 
                i.ticker,
                t.period_date,
                MAX(e.date) AS latest_date
            FROM 
                investment i
                CROSS JOIN t
                JOIN equities e 
                  ON i.ticker = e.ticker AND e.date <= t.period_date
            WHERE 
                i.user_id = $2
            GROUP BY 
                i.ticker, t.period_date
        ),
        portfolio_values AS (
            SELECT 
                lpp.period_date,
                SUM(i.amount * e.close) AS total_portfolio_value
            FROM 
                latest_prices_per_period lpp
                JOIN equities e 
                  ON lpp.ticker = e.ticker AND lpp.latest_date = e.date
                JOIN investment i 
                  ON i.ticker = lpp.ticker
            WHERE 
                i.user_id = $2
            GROUP BY 
                lpp.period_date
        )
        SELECT 
            period_date, 
            COALESCE(total_portfolio_value, 0) AS total_portfolio_value
        FROM 
            portfolio_values
        ORDER BY 
            period_date;
        `;

            // Map timePeriod to PostgreSQL interval
            const intervalMap = {
                "1D": "2 days",
                "1W": "7 days",
                "1M": "1 month",
                "1Y": "1 year",
                "5Y": "5 years"
            };

            const result = await pool.query(query, [intervalMap[timePeriod], user_id]);

            const formattedResult = result.rows.map(row => ({
                date: row.period_date,
                portfolioValue: parseFloat(row.total_portfolio_value)
            }));

            res.json({ timePeriod, data: formattedResult });
        } catch (err) {
            console.error("Error fetching portfolio history:", err);
            res.status(500).json({ error: "An error occurred while fetching portfolio history." });
        }
    });




    // GET available stocks in dataset
    router.get("/equity", async (req, res) => {
        try {
            const {prefix} = req.query;

            const result = await pool.query(
                "SELECT * FROM stock_desc WHERE ticker LIKE $1 LIMIT 10",
                [prefix + '%']
            );

            res.json({equities: result.rows});
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching related equities"});
        }
    })

    // POST add a stock purchase that the user has made
    router.post("/investment", verifyToken, async (req, res) => {
        try {
            const {user_id} = req.user;
            const {date, amount, ticker} = req.body;

            if(!date || !amount || !ticker) {
                return res.status(401).json({ message: "Invalid request" });
            }

            const verify_valid = await pool.query(
                "SELECT COUNT(*) FROM stock_desc WHERE ticker = $1", [ticker]
            )

            if(verify_valid.rows[0].count === 0) {
                return res.status(404).json({message: "Equity not found in database"})
            }

            const result = await pool.query(
                "INSERT INTO investment (purchase_date, amount, user_id, ticker) VALUES ($1, $2, $3, $4) RETURNING *",
                [date, amount, user_id, ticker]
            )

            return res.status(200).json({message: "Successfully added investment", result})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Error while adding investment"});
        }
    })

    // Get information about last n days of equity movement
    router.get("/equity/:id", async (req, res) => {
        try {
            let ticker = req.params.id;
            let num_results = parseInt(req.query.expected, 10) || 1;

            const verify_valid = await pool.query(
                "SELECT COUNT(*) FROM stock_desc WHERE ticker = $1", [ticker]
            )

            if(verify_valid.rows[0].count === 0) {
                return res.status(404).json({message: "Equity not found in database"})
            }

            const result = await pool.query(
                "SELECT * FROM equities WHERE ticker = $1 ORDER BY date DESC LIMIT $2",
                [ticker, num_results]
            );

            return res.status(200).json({equities: result.rows})
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Error fetching equity prices"})
        }

    })


    return router;
};
