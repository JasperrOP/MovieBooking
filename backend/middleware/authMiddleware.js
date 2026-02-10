const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect: Verifies the user is logged in
const protect = async (req, res, next) => {
  let token;

  // Check if the "Authorization" header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token string (remove "Bearer " from the start)
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using our Secret Key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in DB and attach it to the request object
      // .select('-password') means "don't give me the password"
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next step
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// 2. Admin: Verifies the user has the 'admin' role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };