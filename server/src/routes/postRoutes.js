const express = require('express');
const {
  authenticate,
  upload,
  botDetection,
  handleMulterError,
} = require('../middlewares');
const { postController } = require('../controllers');

const postRouter = express.Router();

postRouter.post(
  '/create',
  authenticate,
  upload.array('media', 3),
  handleMulterError,
  postController.createPost
);
postRouter.get('/all', authenticate, postController.getAllPost);
postRouter.get('/explore', authenticate, postController.getExplorePost);
postRouter.get(
  '/likes/:postId',
  authenticate,
  postController.getListUserLikedThePost
);
postRouter.get(
  '/comments/:postId',
  authenticate,
  postController.getPostComments
);
postRouter.put(
  '/likeAndUnlike/:postId',
  authenticate,
  botDetection,
  postController.likeAndUnlikePost
);
postRouter.put(
  '/view/:postId',
  authenticate,
  botDetection,
  postController.viewpost
);
postRouter.post(
  '/comments-add/:postId',
  authenticate,
  postController.postComment
);
postRouter.put(
  '/comments-update/:postId/:commentId',
  authenticate,
  postController.updateComment
);
postRouter.delete(
  '/comments-delete/:postId/:commentId',
  authenticate,
  postController.deleteComment
);
postRouter.post(
  '/comments-reply-add/:postId/:commentId',
  authenticate,
  postController.commentReply
);
postRouter.put(
  '/comments-reply-update/:postId/:commentId/:replyId',
  authenticate,
  postController.updateReply
);
postRouter.delete(
  '/comments-reply-delete/:postId/:commentId/:replyId',
  authenticate,
  postController.deleteReply
);

module.exports = postRouter;
