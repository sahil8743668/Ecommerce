const asyncHandler = require('express-async-handler');
const Loyalty = require('../models/Loyalty');

const EARN_RATE = 0.1; // 1 point per ₹10
const REDEEM_VALUE = 1; // 1 point = ₹1
const MAX_REDEEM_PERCENT = 20; // max 20% of order can be paid with points

const getOrCreate = async (userId) => {
  let loyalty = await Loyalty.findOne({ user: userId });
  if (!loyalty) loyalty = await Loyalty.create({ user: userId });
  return loyalty;
};

// @GET /api/loyalty
exports.getLoyalty = asyncHandler(async (req, res) => {
  const loyalty = await getOrCreate(req.user._id);
  res.json({ success: true, points: loyalty.points, totalEarned: loyalty.totalEarned, history: loyalty.history.slice(-20).reverse() });
});

// Earn points after order placed (internal)
exports.earnPoints = async (userId, orderTotal, orderId) => {
  const points = Math.floor(orderTotal * EARN_RATE);
  if (points <= 0) return;
  const loyalty = await getOrCreate(userId);
  loyalty.points += points;
  loyalty.totalEarned += points;
  loyalty.history.push({ type: 'earned', points, description: `Earned on order ₹${orderTotal}`, orderId });
  await loyalty.save();
};

// Redeem points (internal)
exports.redeemPoints = async (userId, points, orderId) => {
  const loyalty = await getOrCreate(userId);
  if (loyalty.points < points) throw new Error('Insufficient loyalty points');
  loyalty.points -= points;
  loyalty.totalRedeemed += points;
  loyalty.history.push({ type: 'redeemed', points, description: `Redeemed for discount`, orderId });
  await loyalty.save();
  return points * REDEEM_VALUE; // return rupee value
};

// @GET /api/loyalty/calculate?points=X&orderTotal=Y
exports.calculateRedeem = asyncHandler(async (req, res) => {
  const { points, orderTotal } = req.query;
  const loyalty = await getOrCreate(req.user._id);
  const maxByPercent = (orderTotal * MAX_REDEEM_PERCENT) / 100;
  const maxPoints = Math.min(loyalty.points, +points || loyalty.points, maxByPercent);
  const discount = Math.floor(maxPoints) * REDEEM_VALUE;
  res.json({ success: true, availablePoints: loyalty.points, pointsToUse: Math.floor(maxPoints), discount });
});

exports.getOrCreate = getOrCreate;
exports.REDEEM_VALUE = REDEEM_VALUE;
