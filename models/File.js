const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the collection
const FileSchema = new Schema({
    public_id: {
        type: String,
        required: true,
        unique: true
    },
    uri: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    public: {
        type: Boolean,
        required: true
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// Create a model using the schema
const File = mongoose.model('file', FileSchema);

module.exports = File;