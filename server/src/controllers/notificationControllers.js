const { asyncHandler } = require('../middlewares');
const { NotificationModel } = require('../models');

const getNotification = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const notifications = await NotificationModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('from', 'username profilePic')
    .populate('post', 'content');
  return apiResponse(
    req,
    res,
    200,
    'Notifications fetched successfully',
    notifications
  );
});

const readNotification = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;
  const notification = await NotificationModel.findById(notificationId);
  if (!notification) {
    const error = new Error('Notification not found');
    return apiError(next, error, req, 404);
  }
  notification.read = true;
  await notification.save();
  return apiResponse(req, res, 200, 'Notification marked as read');
});

const notificationController = {
  getNotification,
  readNotification,
};

module.exports = notificationController;
