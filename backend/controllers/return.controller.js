const asyncHandler = require('express-async-handler');
const Return = require('../models/Return');
const Order = require('../models/Order');
const { creditWalletInternal } = require('./wallet.controller');
const sendEmail = require('../utils/sendEmail');

// @POST /api/returns
exports.createReturn = asyncHandler(async (req, res) => {
  const { orderId, reason, description, items } = req.body;
  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Access denied'); }
  if (order.orderStatus !== 'delivered') { res.status(400); throw new Error('Only delivered orders can be returned'); }

  const existingReturn = await Return.findOne({ order: orderId, user: req.user._id });
  if (existingReturn) { res.status(400); throw new Error('Return already requested for this order'); }

  const refundAmount = items
    ? items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    : order.totalPrice;

  const returnReq = await Return.create({
    order: orderId, user: req.user._id,
    reason, description, items, refundAmount,
    images: req.files?.map(f => ({ public_id: f.filename, url: f.path })) || [],
  });

  res.status(201).json({ success: true, return: returnReq });
});

// @GET /api/returns/my-returns
exports.getMyReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find({ user: req.user._id }).populate('order').sort('-createdAt');
  res.json({ success: true, returns });
});

// @GET /api/returns  [Admin]
exports.getAllReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find().populate('user', 'name email').populate('order').sort('-createdAt');
  res.json({ success: true, returns });
});

// @PUT /api/returns/:id/status  [Admin]
exports.updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  const returnReq = await Return.findById(req.params.id).populate('order');
  if (!returnReq) { res.status(404); throw new Error('Return request not found'); }

  returnReq.status = status;
  returnReq.adminNote = adminNote;
  returnReq.resolvedAt = status !== 'pending' ? Date.now() : null;
  await returnReq.save();

  // Process refund if approved
  if (status === 'approved') {
    await creditWalletInternal(
      returnReq.user,
      returnReq.refundAmount,
      `Refund for order #${returnReq.order._id.toString().slice(-8).toUpperCase()}`,
      returnReq.order._id
    );
    // Send email
    const user = await require('../models/User').findById(returnReq.user);
    await sendEmail({
      to: user.email,
      subject: 'Return Approved — A to Z Cart',
      html: `<p>Hi ${user.name}, your return has been approved. ₹${returnReq.refundAmount} has been credited to your wallet.</p>`,
    });
  }

  res.json({ success: true, return: returnReq });
});
