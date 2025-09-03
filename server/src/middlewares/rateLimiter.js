const { default: rateLimit } = require('express-rate-limit');
const { apiResponse } = require('../utils');

const likeLimiter = rateLimit({
  windowMs: 60 * 100,
  limit: 5,
  keyGenerator: (req) => req.user?.id || req.clientIp,
  handler: async (req, res) => {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    if (post) {
      post.botLikes += 1;
      await post.save();
    }
    return apiResponse(req, res, 429, 'Too many liked, Bot detected', null);
  },
});
const viewLimiter = rateLimit({
  windowMs: 60 * 100,
  limit: 5,
  keyGenerator: (req) => req.user?.id || req.clientIp,
  handler: async (req, res) => {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    if (post) {
      post.botViews += 1;
      await post.save();
    }
    return apiResponse(req, res, 429, 'Too many liked, Bot detected', null);
  },
});

module.exports = {
  likeLimiter,
  viewLimiter,
};
