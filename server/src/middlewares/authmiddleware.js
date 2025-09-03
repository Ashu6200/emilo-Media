const { config } = require('../configs');
const { UserModel } = require('../models');
const { apiError } = require('../utils');
const asyncHandler = require('./asyncHandler');
const jwt = require('jsonwebtoken');

const authenticate = asyncHandler(async (req, _res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    const error = new Error('Unauthorized access: No token provided');
    return apiError(next, error, req, 401);
  }
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      const error = new Error('`User not found`');
      return apiError(next, error, req, 401);
    }
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return apiError(next, error, req, 401);
  }
});
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      const error = new Error('Unauthorized access');
      return apiError(next, error, req, 401);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('Forbidden access this resource');
      return apiError(next, error, req, 403);
    }
    next();
  };
};

const socketAuthenticate = async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error: No token provided'));

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      const error = new Error('Unauthorized access: User not found');
      return apiError(next, error, req, 401);
    }

    socket.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    const error = new Error('Socket Authentication error: Invalid token');
    return apiError(next, error, req, 401);
  }
};
module.exports = { authenticate, authorize, socketAuthenticate };
