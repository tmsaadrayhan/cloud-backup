const jwt = require('jsonwebtoken');

// Assuming you have a process.env.JWTPRIVATEKEY set

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Split the header to get the token (format: 'Bearer <token>')
  const [, token] = authHeader.split(' ');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

    // Attach the decoded user ID to the request object
    req.userId = decoded._id;

    // Continue to the next middleware or route handler
    console.log("aye")
    next();
  } catch (error) {
    // Handle JWT errors (e.g., expired token, invalid signature)
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyJWT;