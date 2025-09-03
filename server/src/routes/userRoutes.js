const express = require('express');
const { userController } = require('../controllers');
const { authenticate, upload } = require('../middlewares');

const userRouter = express.Router();

userRouter.get('/all-users', authenticate, userController.getAllUser);
userRouter.get('/me', authenticate, userController.getYourProfile);
userRouter.get('/:id', authenticate, userController.getUserProfile);
userRouter.put(
  '/update_profile',
  authenticate,
  upload.single('image'),
  userController.updateProfile
);
userRouter.put(
  '/followAndUnfollow/:userId',
  authenticate,
  userController.followAndUnfollowUser
);
userRouter.get(
  '/followers/:userId',
  authenticate,
  userController.getUserFollowers
);
userRouter.get(
  '/following/:userId',
  authenticate,
  userController.getUserFollowing
);
userRouter.get('/search', authenticate, userController.getSearchUser);
userRouter.get(
  '/posts/:userId',
  authenticate,
  userController.getUserPostbyUserId
);
userRouter.get(
  '/suggested/:userId',
  authenticate,
  userController.getAllSuggestedUser
);

module.exports = userRouter;
