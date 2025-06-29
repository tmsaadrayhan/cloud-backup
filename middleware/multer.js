const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // Rename file with unique identifier
  },
});

const upload = multer({ storage });

module.exports = upload;
