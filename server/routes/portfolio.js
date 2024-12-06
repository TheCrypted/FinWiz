const express = require('express');
const {hash} = require("bcrypt");
const {verifyToken} = require("../middleware/auth");
const router = express.Router();

module.exports = (pool) => {

    router.get("/investments", verifyToken, async (req, res) => {
        try {
            const {user_id} = req.user;

            const result = await pool.query(
                "SELECT * FROM investment WHERE user_id = $1",
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

    router.post("/investment", verifyToken, async (req, res) => {
        try {
            const {user_id} = req.user;
            const {date, amount, ticker} = req.body;

            const verify_valid = await pool.query(
                "SELECT COUNT(*) FROM stock_desc WHERE ticker = $1", [ticker]
            )

            if(verify_valid.rows[0].count === 0) {
                return res.status(404).json({message: "Equity not found in database"})
            }

            const result = await pool.query(
                "INSERT INTO investment (purchase_date, amount, user_id, ticker) VALUES ($1, $2, $3, $4) RETURNING *",
                [new Date(), amount, user_id, ticker]
            )

            return res.status(200).json({message: "Successfully added investment", result})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Error while adding investment"});
        }
    })

    // SELECT open from stock_price WHERE ticker = 'CSCO' ORDER BY date DESC LIMIT 1;
    return router;
};
