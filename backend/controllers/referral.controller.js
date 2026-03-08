const asyncHandler = require('express-async-handler');
const Referral = require('../models/Referral');
const { creditWalletInternal } = require('./wallet.controller');

const REWARD_AMOUNT = 50; // ₹50 for both referrer and referee

// @GET /api/referral/my-code
exports.getMyReferral = asyncHandler(async (req, res) => {
  let referral = await Referral.findOne({ referrer: req.user._id }).populate('referred', 'name email');
  if (!referral) {
    const code = Referral.generateCode(req.user._id);
    referral = await Referral.create({ referrer: req.user._id, code, rewardAmount: REWARD_AMOUNT });
  }
  res.json({ success: true, code: referral.code, totalEarned: referral.totalEarned, referredCount: referral.referred.length, referred: referral.referred });
});

// Called after new user's FIRST order placed (internal)
exports.processReferralReward = async (newUserId, referralCode) => {
  if (!referralCode) return;
  const referral = await Referral.findOne({ code: referralCode.toUpperCase() });
  if (!referral || referral.referred.includes(newUserId)) return;

  referral.referred.push(newUserId);
  referral.totalEarned += REWARD_AMOUNT;
  await referral.save();

  // Credit both referrer and referee
  await creditWalletInternal(referral.referrer, REWARD_AMOUNT, `Referral reward — friend joined!`);
  await creditWalletInternal(newUserId, REWARD_AMOUNT, `Welcome! Referral bonus from friend`);
};
