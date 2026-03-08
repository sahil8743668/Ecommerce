const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  points:       { type: Number, default: 0 },
  totalEarned:  { type: Number, default: 0 },
  totalRedeemed:{ type: Number, default: 0 },
  history: [{
    type:        { type: String, enum: ['earned', 'redeemed'], required: true },
    points:      Number,
    description: String,
    orderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    createdAt:   { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// 1 point = ₹1. Earn 1 point per ₹10 spent
loyaltySchema.statics.EARN_RATE = 0.1; // points per rupee
loyaltySchema.statics.REDEEM_RATE = 1; // 1 point = ₹1

module.exports = mongoose.model('Loyalty', loyaltySchema);
