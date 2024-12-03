const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('routes/routes');
const country = require('routes/country');
const ranking = require('routes/ranking');
const home = require('./home');


const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// app.get('/getEducationInfo/:country_name', country.getEducationInfo);
// app.get('/getIMFInfo/:country_name', country.getIMFInfo);
// app.get('/getIMFPerformance/:country_name', country.getIMFPerformance);
// app.get('/getSummaryStockInfo/:country_name', country.getSummaryStockInfo);
// app.get('/getSimilarEducationCountries/:country_name', country.getSimilarEducationCountries);
// app.get('/getPercentageDiffEducation/:country_name', country.getPercentageDiffEducation);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
