const express = require('express');
const pool = require('./db');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use('/', routes(pool));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
