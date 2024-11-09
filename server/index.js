const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'international-finance.c8zsneyvnkph.us-east-1.rds.amazonaws.com',
    database: 'YOUR_DATABASE_NAME',
    password: 'YOUR_PASSWORD',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        let req = "SELECT * FROM table"
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'Server is running',
            time: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});