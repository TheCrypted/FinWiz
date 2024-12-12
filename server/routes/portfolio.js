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
