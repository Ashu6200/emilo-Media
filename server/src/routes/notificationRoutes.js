const express = require('express');
const { authenticate } = require('../middlewares');
const notificationController = require('../controllers/NotificationControllers');

const notificationRouter = express.Router();

notificationRouter.get(
  '/all',
  authenticate,
  notificationController.getNotification
);
notificationRouter.put(
  '/:id',
  authenticate,
  notificationController.readNotification
);

module.exports = notificationRouter;
