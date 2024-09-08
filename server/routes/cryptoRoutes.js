const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const Cryptocurrency = require('../models/Cryptocurrency');
const router = express.Router();

// Create a cache instance with a TTL of 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

// Existing route to add a new cryptocurrency
router.post('/add', async (req, res) => {
  const { name, symbol, price, marketCap, volume, change24h } = req.body;

  try {
    const newCrypto = new Cryptocurrency({
      name,
      symbol,
      price,
      marketCap,
      volume,
      change24h,
    });

    await newCrypto.save();
    res.json(newCrypto);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// New route to fetch top 50 cryptocurrencies from CoinGecko with caching
router.get('/cryptos', async (req, res) => {
  const cacheKey = 'topCryptos';

  // Check if data is in the cache
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
      },
    });

    // Cache the response data
    cache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cryptos from CoinGecko:', error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrencies' });
  }
});

// Fetch details for a specific cryptocurrency with caching
router.get('/coins/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `crypto-${id}`;

  // Check if data is in the cache
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);

    // Cache the response data
    cache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error);
    res.status(500).json({ message: `Failed to fetch details for ${id}` });
  }
});

module.exports = router;
