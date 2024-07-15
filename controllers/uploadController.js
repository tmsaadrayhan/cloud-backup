const cloudinary = require("cloudinary").v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Handle file upload to Cloudinary
exports.uploadFiles = async (req, res) => {
  const files = req.files;
  const uploadedFiles = [];

  try {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.buffer); // Uploads file to Cloudinary
      uploadedFiles.push({
        public_id: result.public_id,
        original_filename: result.original_filename,
        url: result.secure_url,
      });
    }

    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
};
