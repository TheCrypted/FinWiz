const express = require('express');
const {hash} = require("bcrypt");
const {sign, verify} = require("jsonwebtoken");
const router = express.Router();
require('dotenv').config();


module.exports = (pool) => {

    router.post("/register", async (req, res) => {
        const {email, password, username} = req.body;
        try {
            const hashedPassword = await hash(password, 10);

            const result = await pool.query(
                "INSERT INTO Users (user_id, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
                [Date.now().toString(), email, username, hashedPassword]
            );

            res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error registering user" });
        }
    })

    router.post("/login", async (req, res) => {
        const { email, password } = req.body;

        try {
            const result = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
            const user = result.rows[0];

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

            res.status(200).json({ message: "Login successful", token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error logging in" });
        }
    });

    function authenticateToken(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied" });
        }
        verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = user;
            next();
        });
    }

    router.get("/protected", authenticateToken, (req, res) => {
        res.status(200).json({ message: "You have access to this protected route", user: req.user });
    });

    return router;
};
