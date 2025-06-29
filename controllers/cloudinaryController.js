// Placeholder for saving Cloudinary details to database or performing other operations
exports.saveCloudinaryDetails = async (req, res) => {
    const cloudinaryDetails = req.body; // Assuming req.body contains Cloudinary details
    console.log(cloudinaryDetails);
    res.status(200).json({ message: 'Cloudinary details saved successfully' });
  };
  