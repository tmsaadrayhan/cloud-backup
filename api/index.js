const express = require("express");
const connectDB = require("../config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const apiRoutes = require("../routes/api");
const folder = require("../routes/folder");
const file = require("../routes/file");
const userRoutes = require("../routes/user/user");
const authRoutes = require("../routes/user/auth");
const cloudinary = require("../config/cloudinaryConfig");

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer middleware for handling multipart/form-data
const upload = multer();
connectDB();
// Routes
app.use("/api", apiRoutes);
app.use("/folder", folder);
app.use("/file", file);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

