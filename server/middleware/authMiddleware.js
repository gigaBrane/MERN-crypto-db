const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_jwt_secret'; // Hardcoded but should be in .env for production

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token part
      const decoded = jwt.verify(token, JWT_SECRET); // Verify the token

      // Find the user by ID and attach user to req object, omitting the password
      req.user = await User.findById(decoded.id).select('-password');
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' }); // No token found in the header
  }
};

module.exports = { protect };
