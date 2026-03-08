const asyncHandler = require('express-async-handler');
const { Banner, FlashSale } = require('../models/Banner');

// BANNERS
exports.getBanners = asyncHandler(async (req, res) => {
  const now = new Date();
  const banners = await Banner.find({
    isActive: true,
    $or: [{ startDate: null }, { startDate: { $lte: now } }],
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  }).sort('order');
  res.json({ success: true, banners });
});

exports.createBanner = asyncHandler(async (req, res) => {
  const image = req.file ? { public_id: req.file.filename, url: req.file.path } : undefined;
  const banner = await Banner.create({ ...req.body, image });
  res.status(201).json({ success: true, banner });
});

exports.updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, banner });
});

exports.deleteBanner = asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Banner deleted' });
});

// FLASH SALES
exports.getActiveFlashSale = asyncHandler(async (req, res) => {
  const now = new Date();
  const sale = await FlashSale.findOne({ isActive: true, startTime: { $lte: now }, endTime: { $gte: now } })
    .populate('products', 'name images price discountPrice');
  res.json({ success: true, sale });
});

exports.createFlashSale = asyncHandler(async (req, res) => {
  const sale = await FlashSale.create(req.body);
  res.status(201).json({ success: true, sale });
});
