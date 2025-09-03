require('dotenv').config({
  override: true,
  quiet: true,
  debug: false,
  path: ['.env.local', '.env'],
});

const config = {
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  MONGOODB_URL: process.env.MONGOODB_URL,
  ORIGIN: process.env.ORIGIN,
  SECRET_KEY: process.env.SECRET_KEY,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
};
module.exports = config;
