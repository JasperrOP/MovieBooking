const User = require('../models/User'); // Import the blueprint we made earlier
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body; // 1. Get data from the request

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // 400 means "Bad Request"
    throw new Error('User already exists');
  }

  // 3. Create the new user in the database
  // Note: The .pre('save') middleware in User.js will run automatically here to encrypt the password!
  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  // 4. If successful, send back the user info + their new Token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate the "wristband"
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND if the password matches (using our custom method)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // 401 means "Unauthorized"
    throw new Error('Invalid email or password');
  }
};

module.exports = { registerUser, authUser };