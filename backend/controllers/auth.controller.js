const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, referralCode } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password, referralCode });
  const otp = user.generateOTP();
  await user.save();
  await sendEmail({ to: email, subject: 'Verify your A to Z Cart account', html: `<h2>OTP: <strong>${otp}</strong></h2><p>Valid 10 min.</p>` });
  res.status(201).json({ success: true, requiresVerification: true, token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
});

exports.verifyOTP = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.otp?.code) { res.status(400); throw new Error('No OTP found'); }
  if (new Date() > user.otp.expiresAt) { res.status(400); throw new Error('OTP expired'); }
  if (user.otp.code !== req.body.otp) { res.status(400); throw new Error('Invalid OTP'); }
  user.isVerified = true; user.otp = undefined;
  await user.save();
  res.json({ success: true, message: 'Email verified!' });
});

exports.resendOTP = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const otp = user.generateOTP();
  await user.save();
  await sendEmail({ to: user.email, subject: 'New OTP — A to Z Cart', html: `<h2>OTP: <strong>${otp}</strong></h2>` });
  res.json({ success: true, message: 'OTP sent' });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // 🔧 FIX: अगर user verify नहीं है तो login allow नहीं करेगा
  if (!user.isVerified) {
    res.status(401);
    throw new Error('Please verify your email using OTP');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified
    }
  });
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { googleId, email, name, avatar } = req.body;
  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  if (!user) user = await User.create({ name, email, googleId, isVerified: true, avatar: { url: avatar } });
  else if (!user.googleId) { user.googleId = googleId; user.isVerified = true; await user.save(); }
  res.json({ success: true, token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: user.isVerified } });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) { res.status(404); throw new Error('No user found'); }
  const token = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  await sendEmail({ to: user.email, subject: 'Reset Password — A to Z Cart', html: `<a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a>` });
  res.json({ success: true, message: 'Reset email sent' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hash, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) { res.status(400); throw new Error('Invalid or expired token'); }
  user.password = req.body.password; user.resetPasswordToken = undefined; user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ success: true, token: generateToken(user._id) });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images discountPrice');
  res.json({ success: true, user });
});