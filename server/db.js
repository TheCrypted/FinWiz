const { Pool } = require('pg');
const config = require('./config.json');
require('dotenv').config();

const pool = new Pool({
    ssl: false,
    user: config.rds_user,
    host: config.rds_host,
    database: config.rds_db,
    password: config.rds_password,
    port: config.rds_port,
    ssl: {
        rejectUnauthorized: false,
      },
});

pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

module.exports = pool;

