const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
  fullName:  { type: String, required: true },
  phone:     { type: String, required: true },
  street:    { type: String, required: true },
  city:      { type: String, required: true },
  state:     { type: String, required: true },
  pincode:   { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, minlength: 6, select: false },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:    { public_id: String, url: { type: String, default: '' } },
  addresses: [addressSchema],
  wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  phone:     { type: String },
  isVerified:{ type: Boolean, default: false },
  otp:       { code: String, expiresAt: Date },
  googleId:  { type: String },
  referralCode: { type: String },
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  stockAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  resetPasswordToken:  String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function(entered) { return bcrypt.compare(entered, this.password); };
userSchema.methods.getResetPasswordToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return token;
};
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  return otp;
};
userSchema.methods.addRecentlyViewed = function(productId) {
  this.recentlyViewed = this.recentlyViewed.filter(id => id.toString() !== productId.toString());
  this.recentlyViewed.unshift(productId);
  if (this.recentlyViewed.length > 10) this.recentlyViewed.pop();
};
module.exports = mongoose.model('User', userSchema);
