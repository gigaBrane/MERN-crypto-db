const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');
const newsRoutes = require('./routes/newsRoutes'); // Import the news routes

// Hardcoded MongoDB URI (should be in .env for production)
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Allow only requests from the frontend
  credentials: true, // If you're dealing with cookies, sessions, etc.
}));

app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error', err));

// Import routes
const cryptoRoutes = require('./routes/cryptoRoutes');
app.use('/api/crypto', cryptoRoutes);

const portfolioRoutes = require('./routes/portfolioRoutes');
app.use('/api/portfolio', protect, portfolioRoutes); // Protect portfolio routes with JWT

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Add the news route
app.use('/api/news', newsRoutes); // Use the news route under /api/news

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
