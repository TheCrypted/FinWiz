const express = require('express');
const {hash} = require("bcrypt");
const router = express.Router();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const cheerio = require('cheerio');
const {connectToDatabase} = require("../server");

module.exports = (pool) => {
    //api call to bbc news pages 
    router.get('/bbc-news', async (req, res) => {
        try {
            const db = await connectToDatabase();
            const currentDate = new Date().toISOString().split('T')[0];

            // Check if data exists in MongoDB for today's date
            const existingData = await db.collection('bbc_news').findOne({ date: currentDate });

            if (existingData) {
                // If data exists, return it
                return res.json(existingData.articles);
            }

            // If no data found, proceed with scraping
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

            await db.collection('bbc_news').insertOne({
                date: currentDate,
                articles: articles
            });

            res.json(articles);
        } catch (error) {
            console.error('Error fetching BBC news:', error);
            res.status(500).json({ error: 'Failed to fetch news articles' });
        }
    });



    return router
};
