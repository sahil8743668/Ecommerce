const mongoose = require('mongoose');
const crypto = require('crypto');

const referralSchema = new mongoose.Schema({
  referrer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code:         { type: String, unique: true, required: true },
  referred:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rewardAmount: { type: Number, default: 50 }, // ₹50 credit for both
  totalEarned:  { type: Number, default: 0 },
}, { timestamps: true });

referralSchema.statics.generateCode = function(userId) {
  return crypto.createHash('md5').update(userId.toString()).digest('hex').slice(0, 8).toUpperCase();
};

module.exports = mongoose.model('Referral', referralSchema);
