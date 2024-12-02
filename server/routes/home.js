const express = require('express');
const { hash } = require("bcrypt");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

module.exports = (pool) => {
    // Route for complex query 9
    router.get("/home/:country_name", async (req, res) => {
        try {
            const { country_name } = req.params;

            const result = await pool.query(
                
`SELECT
MAX(CASE WHEN e.indicator_code = 'LE' THEN e.value END) AS employment,
MAX(CASE WHEN e.indicator_code = 'PPPGDP' THEN e.value END) AS gdp,
MAX(CASE WHEN e.indicator_code = 'NGSD_NGDP' THEN e.value END) AS gross_national_savings,
MAX(CASE WHEN e.indicator_code = 'PCPI' THEN e.value END) AS inflation_index,
MAX(CASE WHEN e.indicator_code = 'LP' THEN e.value END) AS population,
MAX(CASE WHEN e.indicator_code = 'NID_NGDP' THEN e.value END) AS total_investment,
MAX(CASE WHEN e.indicator_code = 'LUR' THEN e.value END) AS unemployment_rate
FROM
imf e
JOIN
(SELECT country_code, indicator_code, MAX(date) AS latest_year
FROM imf
WHERE indicator_code IN ('LE', 'PPPGDP', 'NGSD_NGDP', 'PCPI', 'LP', 'NID_NGDP', 'LUR')
GROUP BY country_code, indicator_code) latest
ON
e.country_code = latest.country_code
AND e.indicator_code = latest.indicator_code
AND e.date = latest.latest_year
JOIN country c ON e.country_code=c.country_code
WHERE
c.country_name = $1
GROUP BY
e.country_code;`,
                [country_name]
            );

            res.json({
                country_info: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching country summary details" });
        }
    });




    return router
};



