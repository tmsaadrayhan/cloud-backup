const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads'; // Replace with your desired upload directory
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
  });
};

exports.getFile = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.fileName);

  try {
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    res.status(404).send('File not found');
  }
};

exports.deleteFile = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.fileName);

  try {
    fs.unlinkSync(filePath);
    res.status(200).send('File deleted successfully');
  } catch (err) {
    res.status(404).send('File not found');
  }
};
