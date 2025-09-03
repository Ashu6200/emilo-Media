const { asyncHandler } = require('../middlewares');
const { UserModel } = require('../models');
const { apiError, apiResponse } = require('../utils');

const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password } = req.body;
  const isUserExist = await UserModel.findOne({
    email: email,
    username: username,
  });
  if (isUserExist) {
    const error = new Error('User already exists with this email');
    return apiError(next, error, req, 400);
  }
  const user = new UserModel({ fullName, username, email, password });
  await user.save();
  // const token = user.generateAuthToken();
  const { password: pwd, ...userData } = user.toObject();
  const data = {
    ...userData,
  };
  return apiResponse(req, res, 201, 'User registered successfully', data);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    const error = new Error('User not found with this email');
    return apiError(next, error, req, 401);
  }
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    const error = new Error('Invalid password');
    return apiError(next, error, req, 401);
  }
  const token = user.generateAuthToken();
  const { password: pwd, ...userData } = user.toObject();
  const data = {
    ...userData,
    token: token,
  };
  return apiResponse(req, res, 200, 'User logged in successfully', data);
});

const authControllers = {
  register,
  login,
};

module.exports = authControllers;
