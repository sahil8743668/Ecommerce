const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { cloudinary, upload } = require('../config/cloudinary');

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, email, phone }, { new: true });
  res.json({ success: true, user });
});

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
  const user = await User.findById(req.user._id);
  if (user.avatar?.public_id) await cloudinary.uploader.destroy(user.avatar.public_id);
  user.avatar = { public_id: req.file.filename, url: req.file.path };
  await user.save();
  res.json({ success: true, avatar: user.avatar });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.oldPassword))) { res.status(400); throw new Error('Current password incorrect'); }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed' });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.productId);
  const added = idx === -1;
  if (added) user.wishlist.push(req.params.productId);
  else user.wishlist.splice(idx, 1);
  await user.save();
  res.json({ success: true, added, wishlist: user.wishlist });
});

exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.addressId);
  if (!addr) { res.status(404); throw new Error('Address not found'); }
  if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
  Object.assign(addr, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: { _id: req.params.addressId } } });
  res.json({ success: true, message: 'Address deleted' });
});

// Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, count: users.length, users });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});
