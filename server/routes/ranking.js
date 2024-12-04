const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // Route for simple query 3
    router.get("/getTopCountriesEducation/:education_indicator_code", async (req, res) => {
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
    router.get("/getTopCountriesIMF/:imf_indicator_code", async (req, res) => {
        try {
            const { imf_indicator_code } = req.params;

            const result = await pool.query(
                `SELECT
                    c.country_name,
                    AVG(IMF.value) AS avg_value
                FROM
                    imf
                    JOIN country c ON c.country_code = IMF.country_code
                    JOIN imfindicators i ON i.indicator_code = IMF.indicator_code
                WHERE
                    i.indicator_code = $1
                GROUP BY
                    c.country_name
                ORDER BY
                    avg_value DESC
                LIMIT 10;
                `,
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
    router.get("/getTopCountriesCombined", async (req, res) => {
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


    // Route for complex query 5
    router.get("/getTopStocksPerCountry", async (req, res) => {
        try {
            const result = await pool.query(
                `WITH AveragePerformance AS (
                SELECT
                S.name AS stock_name,
                S.country_code,
                AVG(P.close) AS av_performance
                FROM stock_desc S
                JOIN stock_price P on P.ticker = S.ticker
                WHERE P.date BETWEEN '2022-01-01' AND '2023-12-31'
                GROUP BY S.name, S.country_code ),

                TopStocks AS (
                SELECT A.stock_name, A.country_code, A.av_performance
                FROM AveragePerformance A
                WHERE
                (SELECT COUNT(*)
                FROM AveragePerformance P
                WHERE P.country_code = A.country_code AND P.av_performance > A.av_performance)
                <= 5 )
                SELECT
                C.country_name,
                STRING_AGG(T.stock_name, ', ' ORDER BY T.av_performance DESC) AS best_stocks,
                AVG(T.av_performance) AS avg_country_performance
                FROM Country C JOIN TopStocks T ON C.country_code = T.country_code
                GROUP BY C.country_name
                ORDER BY avg_country_performance DESC;
                `);

            res.json({
                rank_stock_info: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching stock ranking details" });
        }
    });


    // Route for complex query 6
    router.get("/getIncreasingIndicators/:country_name", async (req, res) => {
        try {
            const { country_name } = req.params;

            const result = await pool.query(

                `WITH RankedData AS (
                SELECT
                    e.country_code,
                    e.indicator_code,
                    e.year,
                    e.value,
                    ROW_NUMBER() OVER (PARTITION BY e.country_code, e.indicator_code ORDER BY e.year) AS row_num
                FROM Education e
                WHERE e.year BETWEEN 2015 AND 2020
                ),
                ConsecutiveYears AS (
                SELECT
                    r1.country_code,
                    r1.indicator_code,
                    r1.year AS start_year,
                    r2.year AS next_year
                FROM RankedData r1
                JOIN RankedData r2
                    ON r1.country_code = r2.country_code
                    AND r1.indicator_code = r2.indicator_code
                    AND r1.row_num + 1 = r2.row_num
                WHERE r1.value < r2.value
                ),
                AggregatedYears AS (
                SELECT
                    cy.country_code,
                    cy.indicator_code,
                    MIN(cy.start_year) AS begin_year,
                    MAX(cy.next_year) AS end_year
                FROM ConsecutiveYears cy
                GROUP BY cy.country_code, cy.indicator_code
                )
                SELECT
                ei.indicator_name,
                a.begin_year,
                a.end_year
                FROM AggregatedYears a
                JOIN Country c
                ON a.country_code = c.country_code
                JOIN EducationIndicators ei
                ON a.indicator_code = ei.indicator_code
                WHERE c.country_name = $1
                ORDER BY a.end_year-a.begin_year DESC
                LIMIT 30;`,
                [country_name]
            );

            res.json({
                improv_edu_info: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching improving edu details" });
        }
    });

    return router
};
