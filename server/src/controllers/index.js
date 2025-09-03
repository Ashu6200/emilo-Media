const authControllers = require('./authControllers');
const mainController = require('./mainControllers');
const postController = require('./postControllers');
const pricingController = require('./pricingControllers');
const userController = require('./userControllers');

module.exports = {
  authControllers,
  userController,
  postController,
  pricingController,
  mainController,
};
