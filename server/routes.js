const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/imf/summary', async (req, res) => {
        try {
            if(!req.query.country) return res.status(400).send('No country');

            const client = await pool.connect();
            const result = await client.query(`

                SELECT
                    i.indicator_name,
                    imf.value,
                    imf.date
                FROM imfindicators i JOIN imf ON i.indicator_code = imf.indicator_code
                WHERE imf.country_code = '${req.query.country}'
                AND imf.indicator_code IN ('NGDPD','NGDP_RPCH','LUR','PCPIPCH','BCA_NGDPD','GGXWDG_NGDP','NID_NGDP','PPPGDP')
                AND imf.date = (
                    SELECT MAX(date)
                    FROM imf imf2
                    WHERE imf2.indicator_code = imf.indicator_code
                    AND imf2.country_code = imf.country_code
                )
                ORDER BY i.indicator_name;
            
        `);
            client.release();
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
