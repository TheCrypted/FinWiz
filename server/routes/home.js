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




    return router
};
