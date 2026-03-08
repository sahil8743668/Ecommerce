const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), currency: 'inr',
    metadata: { userId: req.user._id.toString() },
  });
  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

exports.stripeWebhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'payment_intent.succeeded') {
    await Order.findOneAndUpdate({ stripePaymentId: event.data.object.id }, { paymentStatus: 'paid', paidAt: new Date() });
  }
  res.json({ received: true });
};

exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const Razorpay = require('razorpay');
  const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
  const order = await razorpay.orders.create({ amount: Math.round(req.body.amount * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` });
  res.json({ success: true, orderId: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
});

exports.verifyRazorpay = asyncHandler(async (req, res) => {
  const crypto = require('crypto');
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expected !== razorpay_signature) { res.status(400); throw new Error('Payment verification failed'); }
  res.json({ success: true, paymentId: razorpay_payment_id });
});
