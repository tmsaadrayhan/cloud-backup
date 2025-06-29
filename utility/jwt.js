const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWTPRIVATEKEY, { expiresIn: "1h" }); // Adjust expiration as needed
};

module.exports = { createToken };