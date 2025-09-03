const { asyncHandler } = require('../middlewares');
const { PostModel, PricingModel, UserModel } = require('../models');
const { apiResponse, apiError } = require('../utils');

const createEmployee = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password, role } = req.body;
  const isUserExist = await UserModel.findOne({ email: email });
  if (isUserExist) {
    const error = new Error('User already exists with this email');
    return apiError(next, error, req, 400);
  }
  const user = new UserModel({ fullName, username, email, password, role });
  await user.save();
  return apiResponse(req, res, 201, 'User registered successfully', user);
});
const getEmployeeList = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find({
    role: { $in: ['manager', 'accountant'] },
  }).select('-password');
  const data = await Promise.all(
    users.map(async (user, index) => {
      return {
        index: index + 1,
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    })
  );
  const table = {
    header: {
      fullName: 'Full Name',
      username: 'Username',
      email: 'Email',
      role: 'Role',
    },
    empolyeeList: data,
  };
  return apiResponse(
    req,
    res,
    200,
    'Employee list fetched successfully',
    table
  );
});
const approvedPost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const { approved } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('user not found');
    return apiError(next, error, req, 404);
  }
  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }
  post.approved = approved;
  await post.save();
  return apiResponse(req, res, 200, 'Post approved successfully', post);
});
const postList = asyncHandler(async (req, res) => {
  const posts = await PostModel.find()
    .populate('author', 'fullName username profilePicture')
    .populate('location', 'city')
    .sort({ createdAt: -1 });
  const postsWithPricing = await Promise.all(
    posts.map(async (post) => {
      try {
        const pricing = await PricingModel.calculatePostPrice(
          post.location,
          post.views.length - post.botViews,
          post.likes.length - post.botLikes
        );

        return {
          _id: post._id,
          location: post.location,
          paid: post.paid,
          approved: post.approved,
          author: post.author,
          botViews: post.botViews,
          botLikes: post.botLikes,
          views: post.views,
          likes: post.likes,
          calculatedPrice: pricing,
          validViewsCount: post.views.length - post.botViews,
          validLikesCount: post.likes.length - post.botLikes,
        };
      } catch (pricingError) {
        console.error(
          'Pricing calculation error for post:',
          post._id,
          pricingError
        );
        return {
          _id: post._id,
          location: post.location,
          paid: post.paid,
          approved: post.approved,
          author: post.author,
          botViews: post.botViews,
          botLikes: post.botLikes,
          views: post.views,
          likes: post.likes,
          calculatedPrice: { viewPrice: 0, likePrice: 0, totalPrice: 0 },
          validViewsCount: post.views.length - post.botViews,
          validLikesCount: post.likes.length - post.botLikes,
          pricingError: 'Pricing not available for this location',
        };
      }
    })
  );
  const table = {
    header: {
      post: 'Post',
      location: 'Location',
      paid: 'Paid',
      approved: 'Approved',
      author: 'Author',
      botViews: 'Bot Views',
      botLikes: 'Bot Likes',
      views: 'Views',
      likes: 'Likes',
      calculatedPrice: 'Calculated Price',
      validViewsCount: 'Valid Views Count',
      validLikesCount: 'Valid Likes Count',
    },
    posts: postsWithPricing,
  };
  return apiResponse(req, res, 200, 'Post approved successfully', table);
});

const approvedPostList = asyncHandler(async (req, res) => {
  const posts = await PostModel.find({ approved: true })
    .populate('author', 'fullName username profilePicture')
    .populate('location', 'city')
    .sort({ createdAt: -1 });
  const postsWithPricing = await Promise.all(
    posts.map(async (post) => {
      try {
        const pricing = await PricingModel.calculatePostPrice(
          post.location,
          post.views.length - post.botViews,
          post.likes.length - post.botLikes
        );

        return {
          _id: post._id,
          location: post.location,
          paid: post.paid,
          approved: post.approved,
          author: post.author,
          botViews: post.botViews,
          botLikes: post.botLikes,
          views: post.views,
          likes: post.likes,
          calculatedPrice: pricing,
          validViewsCount: post.views.length - post.botViews,
          validLikesCount: post.likes.length - post.botLikes,
        };
      } catch (pricingError) {
        console.error(
          'Pricing calculation error for post:',
          post._id,
          pricingError
        );
        return {
          _id: post._id,
          location: post.location,
          paid: post.paid,
          approved: post.approved,
          author: post.author,
          botViews: post.botViews,
          botLikes: post.botLikes,
          views: post.views,
          likes: post.likes,
          calculatedPrice: { viewPrice: 0, likePrice: 0, totalPrice: 0 },
          validViewsCount: post.views.length - post.botViews,
          validLikesCount: post.likes.length - post.botLikes,
          pricingError: 'Pricing not available for this location',
        };
      }
    })
  );

  const table = {
    header: {
      post: 'Post',
      location: 'Location',
      paid: 'Paid',
      approved: 'Approved',
      author: 'Author',
      botViews: 'Bot Views',
      botLikes: 'Bot Likes',
      views: 'Views',
      likes: 'Likes',
      calculatedPrice: 'Calculated Price',
      validViewsCount: 'Valid Views Count',
      validLikesCount: 'Valid Likes Count',
    },
    posts: postsWithPricing,
  };
  console.log(table);
  return apiResponse(req, res, 200, 'Post approved successfully', table);
});
const payment = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const { paid } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('user not found');
    return apiError(next, error, req, 404);
  }
  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }
  post.paid = paid;
  await post.save();
  return apiResponse(req, res, 200, 'Post approved successfully', post);
});
const mainController = {
  createEmployee,
  getEmployeeList,
  approvedPost,
  postList,
  approvedPostList,
  payment,
};
module.exports = mainController;
