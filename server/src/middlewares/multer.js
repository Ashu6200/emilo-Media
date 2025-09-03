const multer = require('multer');
const { storage } = require('../configs');

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 3,
    fieldSize: 10 * 1024 * 1024,
    fields: 10,
    parts: 15,
    headerPairs: 2000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  },
});
const handleMulterError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 10MB per file.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 3 files allowed.',
      });
    }
    if (err.code === 'LIMIT_FIELD_VALUE') {
      return res.status(400).json({
        success: false,
        message: 'Field value too large.',
      });
    }
  }
  next(err);
};

module.exports = { upload, handleMulterError };
