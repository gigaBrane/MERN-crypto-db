// server/routes/newsRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to fetch news from CoinTelegraph RSS feed
router.get('/', async (req, res) => { // This should be a GET request at '/'
  try {
    const rssFeedUrl = 'https://cointelegraph.com/rss';
    const response = await axios.get(rssFeedUrl);
    
    // Set the correct content-type and send the RSS data
    res.set('Content-Type', 'application/rss+xml');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

module.exports = router;
