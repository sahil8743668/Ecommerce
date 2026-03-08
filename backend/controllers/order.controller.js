const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const markCouponUsed = async (code, userId) => {
  const Coupon = require('../models/Coupon');
  await Coupon.findOneAndUpdate({ code }, { $inc: { usedCount: 1 }, $push: { usedBy: userId } });
};

// @POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    couponCode, couponDiscount = 0,
    loyaltyPointsUsed = 0, walletAmountUsed = 0,
  } = req.body;

  if (!orderItems?.length) { res.status(400); throw new Error('No order items'); }

  // Wallet debit
  if (walletAmountUsed > 0) {
    const { debitWalletInternal } = require('./wallet.controller');
    await debitWalletInternal(req.user._id, walletAmountUsed, 'Payment for order');
  }

  // Loyalty points redeem
  if (loyaltyPointsUsed > 0) {
    const { redeemPoints } = require('./loyalty.controller');
    await redeemPoints(req.user._id, loyaltyPointsUsed);
  }

  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    couponCode, couponDiscount, loyaltyPointsUsed, walletAmountUsed,
  });

  if (couponCode) await markCouponUsed(couponCode, req.user._id);

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
  }

  // Earn loyalty points
  const { earnPoints } = require('./loyalty.controller');
  await earnPoints(req.user._id, totalPrice, order._id);

  // Referral (first order)
  const user = await User.findById(req.user._id);
  if (user.referralCode) {
    const count = await Order.countDocuments({ user: req.user._id });
    if (count === 1) {
      const { processReferralReward } = require('./referral.controller');
      await processReferralReward(req.user._id, user.referralCode);
    }
  }

  // Send email
  await sendEmail({
    to: user.email,
    subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} — A to Z Cart`,
    html: `<h2>Thank you ${user.name}! 🎉</h2>
    <p>Order #${order._id.toString().slice(-8).toUpperCase()} placed.</p>
    <p>Total: ₹${totalPrice.toLocaleString()}</p>
    <p>Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>`,
  });

  res.status(201).json({ success: true, order });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, orders });
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Access denied');
  }
  res.json({ success: true, order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  const totalAmount = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  res.json({ success: true, count: orders.length, totalAmount, orders });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.orderStatus = req.body.orderStatus;
  if (req.body.orderStatus === 'delivered') order.deliveredAt = Date.now();
  await order.save();
  await sendEmail({
    to: order.user.email,
    subject: `Order ${req.body.orderStatus} — A to Z Cart`,
    html: `<p>Your order #${order._id.toString().slice(-8).toUpperCase()} is now <strong>${req.body.orderStatus}</strong>.</p>`,
  });
  res.json({ success: true, order });
});

exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.paymentStatus = 'paid'; order.paidAt = Date.now(); order.stripePaymentId = req.body.paymentId;
  await order.save();
  res.json({ success: true, order });
});

exports.reorder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || order.user.toString() !== req.user._id.toString()) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, orderItems: order.orderItems });
});

exports.getAdminStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const allOrders = await Order.find().select('totalPrice createdAt orderStatus');
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const revenue = allOrders.filter(o => o.createdAt >= start && o.createdAt <= end && o.orderStatus !== 'cancelled')
      .reduce((s, o) => s + o.totalPrice, 0);
    monthlyRevenue.push({ month: start.toLocaleString('default', { month: 'short' }), revenue: Math.round(revenue) });
  }
  const totalRevenue = allOrders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0);
  res.json({ success: true, totalOrders: allOrders.length, totalRevenue, monthlyRevenue,
    statusBreakdown: {
      processing: allOrders.filter(o => o.orderStatus === 'processing').length,
      shipped:    allOrders.filter(o => o.orderStatus === 'shipped').length,
      delivered:  allOrders.filter(o => o.orderStatus === 'delivered').length,
      cancelled:  allOrders.filter(o => o.orderStatus === 'cancelled').length,
    }
  });
});
