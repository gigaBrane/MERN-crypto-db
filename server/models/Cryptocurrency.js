const mongoose = require('mongoose');

const CryptocurrencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  marketCap: { type: Number },
  volume: { type: Number },
  change24h: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cryptocurrency', CryptocurrencySchema);
