const { default: mongoose } = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      unique: true,
      required: true,
    },
    pricePerView: {
      type: Number,
      required: true,
    },
    pricePerLike: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
pricingSchema.statics.calculatePostPrice = async function (
  location,
  viewsCount,
  likesCount
) {
  const pricing = await this.findOne({ _id: location });
  if (!pricing) {
    throw new Error(`Pricing not found for location: ${location}`);
  }

  const viewPrice = viewsCount * pricing.pricePerView;
  const likePrice = likesCount * pricing.pricePerLike;
  const totalPrice = viewPrice + likePrice;

  return {
    viewPrice: parseFloat(viewPrice.toFixed(2)),
    likePrice: parseFloat(likePrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};
const PricingModel = mongoose.model('Pricing', pricingSchema);

module.exports = PricingModel;
