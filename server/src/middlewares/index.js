const asyncHandler = require('./asyncHandler');
const {
  authorize,
  authenticate,
  socketAuthenticate,
} = require('./authmiddleware');
const botDetection = require('./botDetection');
const errorHandler = require('./errorHandler');
const { handleMulterError, upload } = require('./multer');
const { likeLimiter, viewLimiter } = require('./rateLimiter');

module.exports = {
  asyncHandler,
  errorHandler,
  authorize,
  authenticate,
  socketAuthenticate,
  upload,
  botDetection,
  viewLimiter,
  likeLimiter,
  handleMulterError,
};
