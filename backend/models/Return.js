const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  order:       { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, reason: String }],
  reason:      { type: String, required: true },
  description: { type: String },
  images:      [{ public_id: String, url: String }],
  status:      { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  refundAmount:{ type: Number },
  refundTo:    { type: String, enum: ['wallet', 'original'], default: 'wallet' },
  adminNote:   { type: String },
  resolvedAt:  { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
