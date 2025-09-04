const { asyncHandler } = require('../middlewares');
const { UserModel, PostModel } = require('../models');
const { apiError, apiResponse } = require('../utils');
const { cloudinary } = require('../configs');

const getAllUser = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find({ _id: { $ne: req.user.id } }).select(
    '-password'
  );

  if (users.length === 0) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }

  const data = await Promise.all(
    users.map(async (user) => {
      const postCount = await PostModel.countDocuments({ author: user._id });
      return {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        postCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isFollower: user.followers.includes(req.user.id),
        isPrivate: user.isPrivate,
      };
    })
  );
  return apiResponse(req, res, 200, 'User profile fetched successfully', data);
});
const getYourProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const isUserExists = await UserModel.findById({ _id: userId }).select(
    '-password'
  );
  if (!isUserExists) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  const postCount = await PostModel.countDocuments({ author: userId });
  const data = {
    fullName: isUserExists.fullName,
    username: isUserExists.username,
    email: isUserExists.email,
    postCount: postCount,
    followersCount: isUserExists.followers.length,
    followingCount: isUserExists.following.length,
    bio: isUserExists.bio,
    profilePicture: isUserExists.profilePicture,
  };

  return apiResponse(req, res, 200, 'User profile fetched successfully', data);
});
const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const isUserExists = await UserModel.findById(userId).select('-password');
  if (!isUserExists) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  const postCount = await PostModel.countDocuments({ author: userId });
  const data = {
    _id: isUserExists._id,
    fullName: isUserExists.fullName,
    username: isUserExists.username,
    email: isUserExists.email,
    postCount: postCount,
    followersCount: isUserExists.followers.length,
    followingCount: isUserExists.following.length,
    bio: isUserExists.bio,
    profilePicture: isUserExists.profilePicture,
    isFollower: isUserExists.followers.includes(req.user.id),
    isPrivate: isUserExists.isPrivate,
  };

  return apiResponse(req, res, 200, 'User profile fetched successfully', data);
});
const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const { fullName, bio, isPrivate } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }

  user.fullName = fullName || user.fullName;
  user.bio = bio || user.bio;
  user.isPrivate = isPrivate !== undefined ? isPrivate : user.isPrivate;
  if (req.file) {
    const publicId = `posts/${req.file.filename}`;
    const type = 'image';
    const mediaObj = {
      type,
      url: req.file.path || file.url,
      publicId,
      thumbnail: '',
    };
    mediaObj.thumbnail = cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'fill',
    });
    user.profilePicture = mediaObj;
  }

  await user.save();

  const { password: pwd, ...updatedUserData } = user.toObject();
  const data = {
    ...updatedUserData,
  };
  return apiResponse(req, res, 200, 'Profile updated successfully', data);
});

const followAndUnfollowUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userToFollowId = req.params?.userId;
  const userToFollow = await UserModel.findById(userToFollowId);
  if (!userToFollow) {
    const error = new Error('User to follow not found');
    return apiError(next, error, req, 404);
  }
  const currentUser = await UserModel.findById(userId);
  if (!currentUser) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  if (currentUser.following.includes(userToFollowId)) {
    currentUser.following.pull(userToFollowId);
    userToFollow.followers.pull(userId);
  } else {
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(userId);
  }
  await currentUser.save();
  await userToFollow.save();
  return apiResponse(req, res, 200, 'User followed successfully');
});
const getUserFollowers = asyncHandler(async (req, res, next) => {
  // const userId = req.user.id;
  const { userId } = req.params;
  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  const followers = await UserModel.find({
    _id: { $in: user.followers },
  }).select('fullName username profilePicture');
  return apiResponse(
    req,
    res,
    200,
    'Followers fetched successfully',
    followers
  );
});
const getUserFollowing = asyncHandler(async (req, res, next) => {
  // const userId = req.user.id;
  const { userId } = req.params;
  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  const following = await UserModel.find({
    _id: { $in: user.following },
  }).select('fullName username profilePicture');
  return apiResponse(
    req,
    res,
    200,
    'Following fetched successfully',
    following
  );
});
const getSearchUser = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ msg: 'Query required' });
  }
  const users = await UserModel.find({ username: { $regex: q, $options: 'i' } })
    .select('-password')
    .limit(10);

  if (!users || users.length === 0) {
    return res.status(404).json({ msg: 'No users found' });
  }
  const userData = await Promise.all(
    users.map(async (user) => {
      const postCount = await PostModel.countDocuments({ author: user._id });

      return {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        postCount,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        bio: user.bio || '',
        profilePicture: user.profilePicture,
      };
    })
  );

  return apiResponse(req, res, 200, 'Users fetched successfully', userData);
});

const getUserPostbyUserId = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const posts = await PostModel.find({ author: userId })
    .select({
      content: 1,
      media: 1,
      location: 1,
      likes: 1,
      comments: 1,
      createdAt: 1,
    })
    .populate('location', { city: 1 })
    .populate('author', {
      username: 1,
      profilePicture: 1,
      fullName: 1,
    })
    .sort({ createdAt: -1 });
  return apiResponse(req, res, 200, 'Posts fetched successfully', posts);
});

const getAllSuggestedUser = asyncHandler(async (req, res, next) => {
  console.log('Suggested user');
  const userId = req.params.userId;

  const users = await UserModel.findById(userId);
  if (!users) {
    return apiError(next, new Error('User not found'), req, 404);
  }
  const followingIds = users.following.map((id) => id.toString());
  followingIds.push(userId);

  const suggestedUsers = await UserModel.find({
    _id: { $nin: [...followingIds, userId] },
    isPrivate: false,
  })
    .select('fullName username profilePicture followers isPrivate email')
    .limit(10);

  const data = suggestedUsers.map((u) => ({
    _id: u._id,
    fullName: u.fullName,
    username: u.username,
    email: u.email,
    profilePicture: u.profilePicture,
    isFollower: u.followers?.some((f) => f.toString() === userId) || false,
    isPrivate: u.isPrivate,
  }));

  return apiResponse(
    req,
    res,
    200,
    'Suggested users fetched successfully',
    data
  );
});
const userController = {
  getAllUser,
  getYourProfile,
  getUserProfile,
  updateProfile,
  followAndUnfollowUser,
  getUserFollowers,
  getUserFollowing,
  getSearchUser,
  getUserPostbyUserId,
  getAllSuggestedUser,
};
module.exports = userController;
