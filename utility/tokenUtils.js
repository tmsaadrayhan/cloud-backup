// utils/tokenUtils.js
const jwt = require('jsonwebtoken');

// Function to generate a reset token
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateResetToken };