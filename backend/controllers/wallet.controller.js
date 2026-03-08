const asyncHandler = require('express-async-handler');
const Wallet = require('../models/Wallet');

const getOrCreate = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) wallet = await Wallet.create({ user: userId });
  return wallet;
};

// @GET /api/wallet
exports.getWallet = asyncHandler(async (req, res) => {
  const wallet = await getOrCreate(req.user._id);
  res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions.slice(-20).reverse() });
});

// @POST /api/wallet/credit  [Admin/Internal]
exports.creditWallet = asyncHandler(async (req, res) => {
  const { userId, amount, description } = req.body;
  const wallet = await getOrCreate(userId || req.user._id);
  await wallet.credit(amount, description);
  res.json({ success: true, balance: wallet.balance });
});

// Internal use: debit wallet at checkout
exports.debitWalletInternal = async (userId, amount, description, orderId) => {
  const wallet = await getOrCreate(userId);
  await wallet.debit(amount, description, orderId);
  return wallet.balance;
};

// Internal use: credit wallet (refund etc.)
exports.creditWalletInternal = async (userId, amount, description, orderId) => {
  const wallet = await getOrCreate(userId);
  await wallet.credit(amount, description, orderId);
  return wallet.balance;
};

exports.getOrCreate = getOrCreate;
