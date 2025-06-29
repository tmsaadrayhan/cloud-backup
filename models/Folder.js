const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the collection
const FolderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    public: {
        type: Boolean,
        required: true
    },
});

// Create a model using the schema
const Folder = mongoose.model('folder', FolderSchema);

module.exports = Folder;