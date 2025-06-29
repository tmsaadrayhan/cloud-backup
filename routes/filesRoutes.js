const express = require('express');
const router = express.Router();
const filesController = require('../controllers/filesController');
const multer = require('multer');

const storage = multer.diskStorage({
  // ... storage configuration
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), filesController.uploadFile);
router.get('/download/:fileName', filesController.getFile);

module.exports = router;
