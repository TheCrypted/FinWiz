const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // route for simple query 1
    router.get("/getEducationInfo/:country_name", async (req, res) => {
        try {
            const {country_name} = req.params;

            const result = await pool.query(
                "SELECT i.indicator_name, AVG(e.value) AS indicator_value FROM Country c JOIN Education e ON e.country_code = c.country_code JOIN EducationIndicators i ON e.indicator_code = i.indicator_code WHERE c.country_name LIKE $1 GROUP BY i.indicator_name ORDER BY i.indicator LIMIT 10",
                [country_name]
            )

            res.json({
                education_info: result.rows
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching country education details"});
        }
    })

    // route for simple query 2
    router.get("/getIMFInfo/:country_name", async (req, res) => {
        try {
            const {country_name} = req.params;

            const result = await pool.query(
                "SELECT i.indicator_name, AVG(IMF.value) FROM Country c JOIN IMF ON IMF.country_code = c.country_code JOIN IMFIndicators i ON i.indicator_code = IMF.indicator_code WHERE c.country_name LIKE $1 GROUP BY i.indicator_name ORDER BY i.indicator_name LIMIT 10",
                [country_name]
            )

            res.json({
                imf_info: result.rows
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching country IMF details"});
        }
    })

    // route for complex query 3 
    router.get("/getIMFPerformance/:country_name", async (req, res) => {
        try {
            const {country_name} = req.params;

            const result = await pool.query(
                "WITH IMFCountryAverages AS (SELECT c.country_name, ii.indicator_name, AVG(i.value) as country_avg, EXTRACT(YEAR FROM i.date) as year FROM IMF i JOIN Country c ON i.country_code = c.country_code JOIN IMFIndicators ii ON i.indicator_code = ii.indicator_code WHERE c.country_name = $1 GROUP BY c.country_name, ii.indicator_name, EXTRACT(YEAR FROM i.date)), IMFGlobalAverages AS (SELECT ii.indicator_name, AVG(i.value) as global_avg, EXTRACT(YEAR FROM i.date) as year FROM IMF i JOIN IMFIndicators ii ON i.indicator_code = ii.indicator_code GROUP BY ii.indicator_name, EXTRACT(YEAR FROM i.date)) SELECT ica.country_name, ica.indicator_name, ica.year::integer, ROUND(ica.country_avg::numeric, 2) as country_average, ROUND(iga.global_avg::numeric, 2) as global_average, ROUND((ica.country_avg - iga.global_avg)::numeric, 2) as percentage_point_difference, CASE WHEN (ica.country_avg - iga.global_avg) > 0 THEN 'Above Average' WHEN (ica.country_avg - iga.global_avg) < 0 THEN 'Below Average' ELSE 'At Average' END as performance_status FROM IMFCountryAverages ica JOIN IMFGlobalAverages iga ON ica.indicator_name = iga.indicator_name AND ica.year = iga.year ORDER BY year DESC, percentage_point_difference DESC LIMIT 10",
                [country_name]
            )

            res.json({
                imf_performance: result.rows
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching country IMF performance"});
        }
    })

    // route for complex query 4
    router.get("/getSummaryStockInfo/:country_name", async (req, res) => {
        try {
            const {country_name} = req.params;

            const result = await pool.query(
                "WITH AvgCloseLastYear AS (SELECT sd.industry_tag AS industry, c.country_name AS country, AVG(sp.close) AS avg_close_last_year FROM stock_price sp JOIN stock_desc sd ON sp.ticker = sd.ticker JOIN country c ON sd.country_code = c.country_code WHERE sp.date BETWEEN '2022-01-01' AND '2022-12-31' AND c.country_name = $1 GROUP BY sd.industry_tag, c.country_name) SELECT sd.industry_tag AS industry, c.country_name AS country, COUNT(sp.ticker) AS company_count, AVG(sp.open) AS avg_open_price, AVG(sp.close) AS avg_close_price, MAX(sp.close) AS max_close_price, MIN(sp.close) AS min_close_price, ROUND(CAST((AVG(sp.close) - COALESCE(acl.avg_close_last_year, 0)) / NULLIF(acl.avg_close_last_year, 0) * 100 AS NUMERIC), 2) AS yoy_close_growth, SUM(CASE WHEN (sp.high - sp.low) > 10 THEN 1 ELSE 0 END) AS high_volatility_count FROM stock_price sp JOIN stock_desc sd ON sp.ticker = sd.ticker JOIN country c ON sd.country_code = c.country_code LEFT JOIN AvgCloseLastYear acl ON sd.industry_tag = acl.industry AND c.country_name = acl.country WHERE sp.date BETWEEN '2023-01-01' AND '2023-12-31' AND c.country_name = $1 GROUP BY sd.industry_tag, c.country_name, acl.avg_close_last_year HAVING COUNT(sp.ticker) >= 5 ORDER BY industry",
                [country_name]
            )

            res.json({
                summary_stock_info: result.rows
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching country stock summary"});
        }
    })

    // route for complex query 7
    router.get("/getSimilarEducationCountries/:country_name", async (req, res) => {
        try {
            const { country_name } = req.params;
    
            // Step 1: Create the materialized view `indicator_stats`
            await pool.query(
                `CREATE MATERIALIZED VIEW IF NOT EXISTS indicator_stats AS
                 SELECT indicator_code, AVG(value) AS mean_value, STDDEV(value) AS stddev_value
                 FROM education
                 GROUP BY indicator_code;`
            );
    
            // Step 2: Create the materialized view `standardized_education`
            await pool.query(
                `CREATE MATERIALIZED VIEW IF NOT EXISTS standardized_education AS
                 SELECT c.country_name, 
                        (e.value - s.mean_value) / NULLIF(s.stddev_value, 0) AS standardized_value
                 FROM education e
                 JOIN indicator_stats s ON e.indicator_code = s.indicator_code
                 JOIN country c ON c.country_code = e.country_code;`
            );
    
            // Step 3: Create the materialized view `country_education_avg`
            await pool.query(
                `CREATE MATERIALIZED VIEW IF NOT EXISTS country_education_avg AS
                 SELECT country_name, AVG(standardized_value) AS country_avg_standardized_value
                 FROM standardized_education
                 GROUP BY country_name;`
            );
    
            // Step 4: Fetch similar countries based on the computed views
            const result = await pool.query(
                `SELECT cea.country_name, 
                        cea.country_avg_standardized_value AS performance_score,
                        ABS(cea.country_avg_standardized_value - (
                            SELECT country_avg_standardized_value
                            FROM country_education_avg
                            WHERE country_name = $1
                        )) AS distance
                 FROM country_education_avg cea
                 WHERE cea.country_name <> $1
                 ORDER BY distance
                 LIMIT 2;`,
                [country_name]
            );
    
            // Respond with the result
            res.json({
                similar_countries: result.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching similar education countries" });
        }
    })
    

    // route for complex query 8
    router.get("/getPercentageDiffEducation/:country_name", async (req, res) => {
        try {
            const {country_name} = req.params;

            const result = await pool.query(
                "WITH education_change AS (SELECT e.country_code, e.indicator_code, e.year, e.value, LAG(e.value) OVER (PARTITION BY e.country_code, e.indicator_code ORDER BY e.year) AS prev FROM education e WHERE e.year BETWEEN 2000 AND 2020) SELECT ei.indicator_name, ec.year, ec.value AS education_value, CASE WHEN ec.prev IS NULL OR ec.prev = 0 THEN NULL ELSE (ec.value - ec.prev) / ec.prev * 100 END AS year_change FROM education_change ec JOIN country c ON ec.country_code = c.country_code JOIN educationindicators ei ON ec.indicator_code = ei.indicator_code WHERE c.country_name = $1 AND ec.prev > 0 AND ec.year = 2020 ORDER BY ec.year DESC",
                [country_name]
            )

            res.json({
                percentage_difference: result.rows
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error fetching percentage difference from past years"});
        }
    })


    return router
};
