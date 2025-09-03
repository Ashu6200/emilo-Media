const { PostModel, UserModel, PricingModel } = require('../models');
const { asyncHandler } = require('../middlewares');
const { apiError, apiResponse } = require('../utils');
const { default: mongoose } = require('mongoose');
const { cloudinary } = require('../configs');
const { io } = require('../app');

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];

const createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return apiError(next, new Error('Content is required'), req, 400);
  }
  if (content.length > 280) {
    return apiError(
      next,
      new Error('Content cannot exceed 280 characters'),
      req,
      400
    );
  }
  if (!req.user || !req.user.id) {
    console.log('ERROR: User not authenticated');
    return apiError(next, new Error('Authentication required'), req, 401);
  }

  const city = cities[Math.floor(Math.random() * cities.length)];
  let pricing = await PricingModel.findOne({ city });
  if (!pricing) {
    pricing = await PricingModel.create({
      city,
      pricePerView: 0,
      pricePerLike: 0,
    });
  }

  const media = [];
  let coverThumbnail = '';

  for (const file of req.files || []) {
    const publicId = `posts/${file.filename}`;
    const type = file.mimetype.startsWith('video') ? 'video' : 'image';

    const mediaObj = {
      type,
      url: file.path || file.url,
      publicId,
      thumbnail: '',
    };

    if (type === 'video') {
      mediaObj.thumbnail = cloudinary.url(publicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 300, height: 300, crop: 'fill', start_offset: 'auto' },
        ],
      });
    } else {
      mediaObj.thumbnail = cloudinary.url(publicId, {
        width: 300,
        height: 300,
        crop: 'fill',
      });
    }

    if (!coverThumbnail) coverThumbnail = mediaObj.thumbnail;
    media.push(mediaObj);
  }

  const post = new PostModel({
    author: req.user.id,
    content,
    media,
    coverThumbnail,
    location: pricing._id,
  });

  await post.save();
  return apiResponse(req, res, 201, 'Post created successfully', post);
});
const getAllPost = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const currentUser = await UserModel.findById(req.user.id);
  if (!currentUser) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  const followedIds = currentUser.following.map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  followedIds.push(currentUser._id);
  const posts = await PostModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    { $unwind: '$author' },
    {
      $lookup: {
        from: 'pricings',
        localField: 'location',
        foreignField: '_id',
        as: 'pricing',
      },
    },
    {
      $match: {
        $or: [
          { 'author.isPrivate': false },
          { 'author._id': { $in: followedIds } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        content: 1,
        media: 1,
        location: {
          _id: { $ifNull: ['$pricing._id', null] },
          city: { $ifNull: ['$pricing.city', null] },
        },
        likes: 1,
        comments: 1,
        createdAt: 1,
        updatedAt: 1,
        author: {
          _id: '$author._id',
          username: '$author.username',
          fullName: '$author.fullName',
          profilePicture: '$author.profilePicture',
        },
      },
    },
  ]);

  return apiResponse(req, res, 200, 'Posts fetched successfully', posts);
});
const getExplorePost = asyncHandler(async (req, res, _next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const posts = await PostModel.find()
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
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  return apiResponse(req, res, 200, 'Posts fetched successfully', posts);
});
const getListUserLikedThePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }
  const users = await UserModel.find({ _id: { $in: post.likes } });
  const data = users.map((user) => {
    return {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    };
  });
  return apiResponse(
    req,
    res,
    200,
    'Users who liked the post fetched successfully',
    data
  );
});
const likeAndUnlikePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const bot = req.isBot;

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }

  const isLiked = post.likes.includes(userId);
  if (bot) {
    post.botLikes = botLikes + 1;
  }

  if (isLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();
    // io.emit('unlikeUpdate', {
    //   postId: postId,
    //   likers: post.likes,
    // });
    return apiResponse(req, res, 200, 'Post unliked successfully', null);
  } else {
    post.likes.push(userId);
    await post.save();
    // io.emit('likeUpdate', {
    //   postId: postId,
    //   likers: post.likes,
    // });
    return apiResponse(req, res, 200, 'Post liked successfully', null);
  }
});
const viewpost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const bot = req.isBot;

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    return apiError(next, error, req, 404);
  }
  if (bot) {
    botViews = botViews + 1;
  }
  const isViewed = post.views.includes(userId);
  if (isViewed) {
    return apiResponse(req, res, 200, 'Already viwed', null);
  }
  post.views.push(userId);
  await post.save();
  io.emit('viewUpdate', {
    postId: postId,
    views: post.views,
  });
  return apiResponse(req, res, 200, 'Post liked successfully', null);
});
const getPostComments = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const post = await PostModel.findById(postId).populate({
    path: 'comments.user',
    select: 'username profilePicture fullName',
  });
  await post.populate({
    path: 'comments.replies.user',
    select: 'username profilePicture fullName',
  });
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }
  return apiResponse(
    req,
    res,
    200,
    'Comments fetched successfully',
    post.comments
  );
});
const postComment = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) {
    const error = new Error('Comment text is required');
    return apiError(next, error, req, 400);
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const newComment = {
    user: userId,
    content: content,
  };

  post.comments.push(newComment);
  await post.save();

  await post.populate({
    path: 'comments.user',
    select: 'username profilePicture fullName',
  });
  // io.emit('newComment', {
  //   postId: postId,
  //   comment: comments,
  // });
  return apiResponse(req, res, 201, 'Comment added successfully', post);
});
const updateComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) {
    const error = new Error('Comment text is required');
    return apiError(next, error, req, 400);
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const comment = post.comments.find((c) => c._id.toString() === commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    return apiError(next, error, req, 404);
  }

  if (comment.user.toString() !== userId.toString()) {
    const error = new Error('You are not authorized to update this comment');
    return apiError(next, error, req, 403);
  }

  comment.content = content;
  await post.save();

  await post.populate({
    path: 'comments.user',
    select: 'username profilePicture fullName',
  });
  return apiResponse(req, res, 200, 'Comment updated successfully', post);
});
const deleteComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;
  console.log('postId', postId);
  console.log('commentId', commentId);
  console.log('userId', userId);

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const commentIndex = post.comments.findIndex(
    (c) => c._id.toString() === commentId
  );
  if (commentIndex === -1) {
    const error = new Error('Comment not found');
    return apiError(next, error, req, 404);
  }

  const comment = post.comments[commentIndex];

  if (comment.user.toString() !== userId.toString()) {
    const error = new Error('You are not authorized to delete this comment');
    return apiError(next, error, req, 403);
  }

  post.comments.splice(commentIndex, 1);
  await post.save();

  return apiResponse(req, res, 200, 'Comment deleted successfully', null);
});
const commentReply = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const userId = req.user.id;
  const { content } = req.body;
  if (!content) {
    const error = new Error('Reply content is required');
    return apiError(next, error, req, 400);
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const comment = post.comments.find((c) => c._id.toString() === commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    return apiError(next, error, req, 404);
  }

  const newReply = {
    user: userId,
    content: content,
  };

  comment.replies.push(newReply);
  await post.save();

  await post.populate({
    path: 'comments.user',
    select: 'username profilePicture fullName',
  });
  await post.populate({
    path: 'comments.replies.user',
    select: 'username profilePicture fullName',
  });
  // io.emit('newReply', {
  //   postId: postId,
  //   commentId: commentId,
  //   reply: replies,
  // });
  return apiResponse(req, res, 201, 'Reply added successfully', post);
});
const updateReply = asyncHandler(async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) {
    const error = new Error('Reply content is required');
    return apiError(next, error, req, 400);
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }

  const comment = post.comments.find((c) => c._id.toString() === commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    return apiError(next, error, req, 404);
  }

  const reply = comment.replies.find((r) => r._id.toString() === replyId);
  if (!reply) {
    const error = new Error('Reply not found');
    return apiError(next, error, req, 404);
  }

  if (reply.user.toString() !== userId.toString()) {
    const error = new Error('You are not authorized to update this reply');
    return apiError(next, error, req, 403);
  }

  reply.content = content;
  await post.save();

  await post.populate({
    path: 'comments.user',
    select: 'username profilePicture fullName',
  });
  await post.populate({
    path: 'comments.replies.user',
    select: 'username profilePicture fullName',
  });
  return apiResponse(req, res, 200, 'Reply updated successfully', post);
});
const deleteReply = asyncHandler(async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;
  const userId = req.user.id;

  const post = await PostModel.findById(postId);
  if (!post) {
    const error = new Error('Post not found');
    return apiError(next, error, req, 404);
  }
  const comment = post.comments.find((c) => c._id.toString() === commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    return apiError(next, error, req, 404);
  }

  const replyIndex = comment.replies.findIndex(
    (r) => r._id.toString() === replyId
  );
  if (replyIndex === -1) {
    const error = new Error('Reply not found');
    return apiError(next, error, req, 404);
  }

  const reply = comment.replies[replyIndex];

  if (reply.user.toString() !== userId.toString()) {
    const error = new Error('You are not authorized to delete this reply');
    return apiError(next, error, req, 403);
  }

  comment.replies.splice(replyIndex, 1);
  await post.save();

  return apiResponse(req, res, 200, 'Reply deleted successfully', null);
});

const postController = {
  getAllPost,
  getExplorePost,
  getListUserLikedThePost,
  likeAndUnlikePost,
  viewpost,
  createPost,
  getPostComments,
  postComment,
  updateComment,
  deleteComment,
  commentReply,
  updateReply,
  deleteReply,
};
module.exports = postController;
