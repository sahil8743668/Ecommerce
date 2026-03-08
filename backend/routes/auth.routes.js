// auth.routes.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
r.post('/register', c.register);
r.post('/login', c.login);
r.post('/google', c.googleLogin);
r.post('/verify-otp', protect, c.verifyOTP);
r.post('/resend-otp', protect, c.resendOTP);
r.post('/forgot-password', c.forgotPassword);
r.post('/reset-password/:token', c.resetPassword);
r.get('/me', protect, c.getMe);
module.exports = r;
