const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType:  { type: String, enum: ['percent', 'flat'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrder:      { type: Number, default: 0 },
  maxDiscount:   { type: Number, default: null }, // cap for percent coupons
  usageLimit:    { type: Number, default: null },
  usedCount:     { type: Number, default: 0 },
  usedBy:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt:     { type: Date, required: true },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

couponSchema.methods.isValid = function(userId, orderTotal) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (new Date() > this.expiresAt) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (this.usedBy.includes(userId)) return { valid: false, message: 'You have already used this coupon' };
  if (orderTotal < this.minOrder) return { valid: false, message: `Minimum order ₹${this.minOrder} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function(orderTotal) {
  if (this.discountType === 'flat') return Math.min(this.discountValue, orderTotal);
  const discount = (orderTotal * this.discountValue) / 100;
  return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount;
};

module.exports = mongoose.model('Coupon', couponSchema);
