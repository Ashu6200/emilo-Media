const { cloudinary, storage } = require('./cloudinary');
const config = require('./config');
const connectDB = require('./connectDB');

module.exports = {
  config,
  connectDB,
  cloudinary,
  storage,
};
