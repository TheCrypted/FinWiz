const express = require('express');
const {hash, compare} = require("bcrypt");
const {sign, verify} = require("jsonwebtoken");
const {verifyToken} = require("../middleware/auth");
const router = express.Router();
require('dotenv').config();

module.exports = (pool) => {

    router.get('/get_user', verifyToken, async (req, res) => {
        try {
            const result = await pool.query(
                "SELECT user_id, email, capital, username FROM Users WHERE user_id = $1",
                [req.user.user_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({message: "User not found"});
            }

            res.json({
                user: result.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching user details"});
        }
    });

    router.post("/register", async (req, res) => {
        const {email, password, username} = req.body;

        try {
            const hashedPassword = await hash(password, 10);
            const result = await pool.query(
                "INSERT INTO Users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
                [email, username, hashedPassword]
            );
            res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error registering user" });
        }
    });

    router.post("/login", async (req, res) => {
        const { username, password } = req.body;
        try {
            const result = await pool.query("SELECT * FROM Users WHERE username = $1", [username]);
            const user = result.rows[0];

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const accessToken = sign(
                { user_id: user.user_id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "120m" }
            );

            const refreshToken = sign(
                { user_id: user.user_id },
                process.env.JWT_REFRESH_KEY,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                message: "Login successful",
                access: accessToken,
                refresh: refreshToken,
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    username: user.username
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error logging in" });
        }
    });

    router.post("/refresh", async (req, res) => {
        const { refresh } = req.body;

        if (!refresh) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        try {
            const decoded = verify(refresh, process.env.JWT_REFRESH_KEY);
            const accessToken = sign(
                { user_id: decoded.user_id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "60m" }
            );

            res.json({
                access: accessToken
            });
        } catch (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
    });

    return router;
}