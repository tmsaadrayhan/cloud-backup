// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/auth");

router.post("/register", authController.register);
router.post("/registerRef", authController.registerRef);
router.get("/users/:id/verify/:token/", authController.registerVerifyToken);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:id/verify/:token", authController.resetPassword);

module.exports = router;