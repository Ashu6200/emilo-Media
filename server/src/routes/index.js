const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
const postRouter = require('./postRoutes');
const mainController = require('./mainroutes');
const pricingRouter = require('./pricingRoutes');

module.exports = {
  authRouter,
  userRouter,
  postRouter,
  pricingRouter,
  mainController,
};
