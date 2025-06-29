const express = require('express');
const router = express.Router();
const cloudinaryController = require('../controllers/cloudinaryController');
const { uploadToCloudinary } = require('../controllers/uploadController');
const upload = require('../middleware/multer');

// Route for uploading files to Cloudinary
router.post('/upload', upload.array('files'), uploadToCloudinary);

// Route for saving Cloudinary details to backend
router.post('/saveCloudinaryDetails', cloudinaryController.saveCloudinaryDetails);

module.exports = router;