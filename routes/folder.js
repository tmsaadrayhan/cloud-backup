const express = require("express");
const router = express.Router();
const help = require("../controllers/folder");

// get all Item
router.get("/", help.getAllItems);

// Get a specific help
router.get("/:id", help.getItemById);

// Create a new help
router.post("/", help.createItem);

// Update a help
router.patch("/:id", help.updateItem);

// Delete a help
router.delete("/", help.deleteItem);

module.exports = router;