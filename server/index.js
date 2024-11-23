const express = require('express');
const pool = require('./db');
const cors = require('cors');
const routes = require('./routes/routes');
const portfolio_routes = require('./routes/portfolio');
const auth_routes = require('./routes/auth_routes');
require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use('/', routes(pool));
app.use('/auth', auth_routes(pool));
app.use('/portfolio', portfolio_routes(pool));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
