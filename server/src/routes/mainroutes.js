const express = require('express');
const mainController = require('../controllers/mainControllers');
const { authenticate, authorize } = require('../middlewares');

const mainRouter = express.Router();

mainRouter.post(
  '/create-empolyee',
  authenticate,
  authorize('admin'),
  mainController.createEmployee
);
mainRouter.get(
  '/get-employees',
  authenticate,
  authorize('admin'),
  mainController.getEmployeeList
);
mainRouter.put(
  '/approved/:postId',
  authenticate,
  authorize('admin', 'manager'),
  mainController.approvedPost
);
mainRouter.get(
  '/postlist',
  authenticate,
  authorize('admin', 'manager'),
  mainController.postList
);
mainRouter.get(
  '/aprovedPostlist',
  authenticate,
  authorize('admin', 'manager', 'accountant'),
  mainController.approvedPostList
);
mainRouter.post(
  '/payment/:postId',
  authenticate,
  authorize('admin', 'manager', 'accountant'),
  mainController.payment
);
module.exports = mainRouter;
