// controllers/userController.js

const { User } = require("../../models/user/user");

// const isAdmin = require("../middleware/adminMiddleware");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Only allow user to view their own profile
    if (user._id.toString() !== req.params.userId) {
      console.log(req.user._id);
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Only allow user to update their own profile
    // if (user._id.toString() !== req.user.userId) {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Use isAdmin middleware to verify admin privileges
    // isAdmin(req, res, async () => {
    //   try {
    //     await User.deleteOne({ _id: user._id }); // Use deleteOne method to remove the user
    //     res.status(200).json({ message: "User deleted successfully" });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: "Server error" });
    //   }
    // });
    await User.deleteOne({ _id: user._id }); // Use deleteOne method to remove the user
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};