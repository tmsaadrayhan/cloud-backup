const Item = require("../models/File");

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { files, folder, public } = req.body;
    for (const file of files.files) {
      const newItem = await Item.create({ public_id: file.public_id, uri: file.url, public: public, folder: folder});
    }
    // const newItem = await Item.create(req.body);
    res.status(201).json(req.body);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: err.errors });
    }
    return res.status(500).json({ err });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
};
