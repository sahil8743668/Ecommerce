const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type:        { type: String, enum: ['credit', 'debit'], required: true },
  amount:      { type: Number, required: true },
  description: { type: String, required: true },
  orderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });

const walletSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  balance:      { type: Number, default: 0, min: 0 },
  transactions: [transactionSchema],
}, { timestamps: true });

walletSchema.methods.credit = async function(amount, description, orderId) {
  this.balance += amount;
  this.transactions.push({ type: 'credit', amount, description, orderId });
  return this.save();
};

walletSchema.methods.debit = async function(amount, description, orderId) {
  if (this.balance < amount) throw new Error('Insufficient wallet balance');
  this.balance -= amount;
  this.transactions.push({ type: 'debit', amount, description, orderId });
  return this.save();
};

module.exports = mongoose.model('Wallet', walletSchema);
