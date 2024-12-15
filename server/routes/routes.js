const express = require('express');
const {hash} = require("bcrypt");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = (pool) => {
    router.get('/bbc-news', async (req, res) => {
        try {
            const response = await axios.get('https://www.bbc.com/news/world');
            const $ = cheerio.load(response.data);
            const articles = [];

            $('a[data-testid="internal-link"]').each((i, element) => {
                if (articles.length >= 3) return false;

                const imgElement = $(element).find('img');
                const titleElement = $(element).find('[data-testid="card-headline"]');
                const descElement = $(element).find('[data-testid="card-description"]');
                const url = $(element).attr('href');

                if (imgElement.length && titleElement.length) {
                    articles.push({
                        imageUrl: `https://www.bbc.com${imgElement.attr('src')}`,
                        thumbnailTitle: titleElement.text().replace('<!-- -->', ''),
                        description: descElement.text().trim(),
                        url: `https://www.bbc.com${url}`
                    });
                }
            });

            res.json(articles);
        } catch (error) {
            console.error('Error fetching BBC news:', error);
            res.status(500).json({ error: 'Failed to fetch news articles' });
        }
    });


    return router
};
