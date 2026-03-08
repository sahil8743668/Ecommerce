const mongoose = require('mongoose');
require("./Category");
const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  images:        [{ public_id: String, url: String }],
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand:         { type: String, default: '' },
  stock:         { type: Number, required: true, default: 0 },
  sold:          { type: Number, default: 0 },
  ratings:       { type: Number, default: 0 },
  numReviews:    { type: Number, default: 0 },
  reviews:       [reviewSchema],
  isFeatured:    { type: Boolean, default: false },
  tags:          [String],
}, { timestamps: true });

// Update ratings on save
productSchema.methods.updateRatings = function () {
  if (this.reviews.length === 0) { this.ratings = 0; this.numReviews = 0; return; }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.ratings = total / this.reviews.length;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
