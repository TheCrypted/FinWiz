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

    return router;
};
