const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const apiRoutes = require('./routes/api');
const cloudinary = require('./config/cloudinaryConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer middleware for handling multipart/form-data
const upload = multer();

// Routes
app.use('/api', upload.array('files'), apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
