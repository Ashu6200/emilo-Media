const express = require('express');
const { authenticate, authorize } = require('../middlewares');
const { pricingController } = require('../controllers');
const pricingRouter = express.Router();

pricingRouter.post(
  '/create',
  authenticate,
  authorize('admin', 'manager'),
  pricingController.createPricing
);
pricingRouter.put(
  '/update/:id',
  authenticate,
  authorize('admin', 'manager'),
  pricingController.createPricing
);
pricingRouter.get(
  '/all',
  authenticate,
  authorize('admin', 'manager'),
  pricingController.getPricing
);
module.exports = pricingRouter;
