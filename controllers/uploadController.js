const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const uploadToCloudinary = async (req, res) => {
  try {
    const files = req.files;

    if (!files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const publicId = `uploads/${uuidv4()}`; // Generate a unique public_id

        cloudinary.uploader.upload(
          file.path,
          { public_id: publicId },
          (err, result) => {
            if (err) return reject(err);
            // Remove the file from the local file system after upload
            fs.unlinkSync(file.path);
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadToCloudinary,
};