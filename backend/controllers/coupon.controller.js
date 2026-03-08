const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @POST /api/coupons/validate
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) { res.status(404); throw new Error('Invalid coupon code'); }

  const check = coupon.isValid(req.user._id, orderTotal);
  if (!check.valid) { res.status(400); throw new Error(check.message); }

  const discount = coupon.calculateDiscount(orderTotal);
  res.json({ success: true, discount: Math.round(discount), coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
});

// @POST /api/coupons  [Admin]
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @GET /api/coupons  [Admin]
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

// @PUT /api/coupons/:id  [Admin]
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, coupon });
});

// @DELETE /api/coupons/:id  [Admin]
exports.deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

// Mark coupon as used (called after order placed)
exports.markCouponUsed = async (code, userId) => {
  await Coupon.findOneAndUpdate(
    { code },
    { $inc: { usedCount: 1 }, $push: { usedBy: userId } }
  );
};
