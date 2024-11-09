const express = require('express');
const pool = require('./db');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions));

app.use('/', routes(pool));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
