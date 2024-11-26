const express = require('express');
const { hash } = require("bcrypt");
const router = express.Router();

module.exports = (pool) => {
    // Route for simple query 3
    router.get("/getTopCountriesEducation/:education_indicator_code", verifyToken, async (req, res) => {
        try {
            const { education_indicator_code } = req.params;

            const result = await pool.query(
                `SELECT c.country_name, AVG(e.value) AS val
                 FROM Education e
                 JOIN Country c ON e.country_code = c.country_code
                 JOIN EducationIndicators i ON e.indicator_code = i.indicator_code
                 WHERE e.indicator_code = $1
                 GROUP BY c.country_name
                 ORDER BY val DESC
                 LIMIT 10;`,
                [education_indicator_code]
            );

            res.json({
                education_info: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching education details" });
        }
    });


    // Route for simple query 4
    router.get("/getTopCountriesIMF/:imf_indicator_code", verifyToken, async (req, res) => {
        try {
            const { imf_indicator_code } = req.params;

            const result = await pool.query(
                `SELECT TOP 10 c.country_name, AVG(IMF.value)
                FROM IMF
                JOIN Country c on c.country_code = IMF.country_code 
                JOIN IMFIndicators i ON i.indicator_code = IMF.indicator_code
                WHERE i.indicator_name LIKE '%{user_input}%'
                GROUP BY IMF.country_code;`,
                [imf_indicator_code]
            );

            res.json({
                imf_info: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching imf details" });
        }
    });

    // Route for complex query 2
    router.get("/getTopCountriesCombined", verifyToken, async (req, res) => {
        try {
            const result = await pool.query(
                `WITH CountryEducationMetrics AS (
                SELECT
                    c.country_name,
                    e.year,
                    AVG(e.value) as avg_education_value,
                    COUNT(DISTINCT e.indicator_code) as num_indicators
                FROM Country c
                JOIN Education e ON c.country_code = e.country_code
                JOIN EducationIndicators ei ON e.indicator_code = ei.indicator_code
                WHERE e.year = 2010
                    OR e.year = 2015
                    OR e.year = 2020
                    OR e.year = 2025
                GROUP BY c.country_name, e.year
            ),
            IMFMetrics AS (
                SELECT
                    c.country_name,
                    EXTRACT(YEAR FROM i.date) as year,
                    AVG(i.value) as avg_imf_value,
                    COUNT(DISTINCT i.indicator_code) as num_imf_indicators
                FROM Country c
                JOIN IMF i ON c.country_code = i.country_code
                JOIN IMFIndicators ii ON i.indicator_code = ii.indicator_code
                WHERE EXTRACT(YEAR FROM i.date) = 2010
                OR EXTRACT(YEAR FROM i.date) = 2015
                    OR EXTRACT(YEAR FROM i.date) = 2020
                    OR EXTRACT(YEAR FROM i.date) = 2025
                GROUP BY c.country_name, EXTRACT(YEAR FROM i.date)
            ),
            RankedCountries AS (
                SELECT
                    cem.country_name,
                    cem.year,
                    cem.avg_education_value,
                    im.avg_imf_value,
                    RANK() OVER (
                        PARTITION BY cem.year
                        ORDER BY (cem.avg_education_value * im.avg_imf_value) DESC
                    ) as country_rank,
                    ROW_NUMBER() OVER (
                        PARTITION BY cem.year
                        ORDER BY (cem.avg_education_value * im.avg_imf_value) DESC
                    ) as row_num
                FROM CountryEducationMetrics cem
                JOIN IMFMetrics im ON cem.country_name = im.country_name
                    AND cem.year = im.year
            --     WHERE cem.num_indicators > 3
            --         AND im.num_imf_indicators > 3
            )
            SELECT
                country_name,
                year,
                avg_education_value,
                avg_imf_value,
                country_rank
            FROM RankedCountries
            WHERE row_num <= 20
            ORDER BY year DESC, country_rank;
            `            );

            res.json({
                rank_info: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching combined ranking details" });
        }
    });









    return router
};
