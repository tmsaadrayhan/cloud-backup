// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'e-commerce',
  });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
