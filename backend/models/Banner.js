const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  subtitle:    { type: String },
  image:       { public_id: String, url: String },
  link:        { type: String, default: '/products' },
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  startDate:   { type: Date },
  endDate:     { type: Date },
  bgColor:     { type: String, default: '#e53935' },
}, { timestamps: true });

const flashSaleSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime:   { type: Date, required: true },
  products:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
const FlashSale = mongoose.model('FlashSale', flashSaleSchema);

module.exports = { Banner, FlashSale };
