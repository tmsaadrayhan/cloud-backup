const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const cloudinaryController = require('../controllers/cloudinaryController');

// Route for uploading files to Cloudinary
router.post('/upload', uploadController.uploadFiles);

// Route for saving Cloudinary details to backend
router.post('/saveCloudinaryDetails', cloudinaryController.saveCloudinaryDetails);

module.exports = router;
