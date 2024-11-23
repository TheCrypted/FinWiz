const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    ssl: false,
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: 5433,
});

module.exports = pool;