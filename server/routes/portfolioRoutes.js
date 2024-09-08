const express = require('express');
const Portfolio = require('../models/Portfolio');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Route to add a cryptocurrency to a user's portfolio
// Protected route: User must be authenticated
router.post('/add', protect, async (req, res) => {
  const { coinId, amount, boughtAt, currentPrice } = req.body;
  const userId = req.user.id; // Get userId from the authenticated user

  try {
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      portfolio = new Portfolio({ userId, cryptocurrencies: [] });
    }

    portfolio.cryptocurrencies.push({ coinId, amount, boughtAt, currentPrice });
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Route to get a user's portfolio
// Protected route: User must be authenticated
router.get('/', protect, async (req, res) => {
  const userId = req.user.id; // Get userId from the authenticated user

  try {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
