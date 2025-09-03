const { asyncHandler } = require('../middlewares');
const { PricingModel } = require('../models');
const { apiResponse, apiError } = require('../utils');

const createPricing = asyncHandler(async (req, res, next) => {
  const { city, pricePerView, pricePerLike } = req.body;
  const pricing = await PricingModel.create({
    city,
    pricePerView,
    pricePerLike,
  });
  return apiResponse(req, res, 200, 'Pricing created successfully', pricing);
});
const upadtePricing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { pricePerView, pricePerLike } = req.body;
  const pricing = await PricingModel.findByIdAndUpdate(
    id,
    { pricePerView, pricePerLike },
    { new: true }
  );
  if (!pricing) {
    const error = new Error('Pricing not found');
    return apiError(next, error, req, 404);
  }
  return apiResponse(req, res, 200, 'Pricing updated successfully', pricing);
});
const getPricing = asyncHandler(async (req, res, next) => {
  const pricing = await PricingModel.find();
  if (!pricing.length > 0) {
    const error = new Error('Pricing not found');
    return apiError(next, error, req, 404);
  }
  const table = {
    header: {
      city: 'City',
      pricePerView: 'Price Per View',
      pricePerLike: 'Price Per Like',
    },
    pricingList: pricing,
  };
  return apiResponse(req, res, 200, 'Pricing fetched successfully', table);
});

const pricingController = {
  createPricing,
  upadtePricing,
  getPricing,
};

module.exports = pricingController;
