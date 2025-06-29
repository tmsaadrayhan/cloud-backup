const { User } = require("../models/user/user");
const jwt = require("jsonwebtoken");

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
  console.log(decoded);
  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    if (decoded.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized admin" });
    }
  } catch (error) {
    // Handle JWT errors (e.g., expired token, invalid signature)
    return res.status(403).json({ message: "Unauthorized admin" });
  }
};

module.exports = isAdmin;
