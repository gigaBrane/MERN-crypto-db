const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cryptocurrencies: [{
    coinId: { type: String, required: true }, // ID of the cryptocurrency
    amount: { type: Number, required: true }, // Amount held by the user
    boughtAt: { type: Number, required: true }, // Price at which it was bought
    currentPrice: { type: Number, required: true } // Current price of the coin
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
