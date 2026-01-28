const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // We are creating a token that contains the User's ID inside it.
  // process.env.JWT_SECRET is the "stamp" that proves we created this token.
  // expiresIn: '30d' means this token works for 30 days.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;