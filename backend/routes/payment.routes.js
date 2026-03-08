const express = require('express');
const r = express.Router();
const c = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

r.post('/create-intent', protect, c.createPaymentIntent);
r.post('/razorpay/create', protect, c.createRazorpayOrder);
r.post('/razorpay/verify', protect, c.verifyRazorpay);
r.post('/webhook', c.stripeWebhook);

module.exports = r;
