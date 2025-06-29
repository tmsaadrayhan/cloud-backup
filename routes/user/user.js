

const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user");
const verifyJWT = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

// Routes accessible by authenticated users
router.get("/:userId", verifyJWT, isAdmin, userController.getUserById);
//router.patch("/:id", userController.updateUser);

//Routes accessible only by admin
// router.delete("/:id", userController.deleteUser); // isAdmin middleware
// router.get("/", userController.getAllUsers); //  get all users

module.exports = router;