const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiFeatures = require('../utils/apiFeatures');
const sendEmail = require('../utils/sendEmail');
const Category = require("../models/Category");

exports.getProducts = asyncHandler(async (req, res) => {
  const resPerPage = 12;

  const totalCount = await Product.countDocuments();

 let query = Product.find().populate({
  path: "category",
  select: "name slug",
  options: { strictPopulate: false }
});

  const features = new ApiFeatures(query, req.query)
    .search()
    .filter()
    .sort()
    .paginate(resPerPage);

  const products = await features.query;

  res.json({
    success: true,
    count: products.length,
    totalCount,
    products
  });
});
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (req.user) {
    const user = await User.findById(req.user._id);
    user.addRecentlyViewed(product._id);
    await user.save();
  }
  res.json({ success: true, product });
});

exports.getRecommended = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Not found'); }
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(6).populate('category', 'name');
  res.json({ success: true, products: related });
});

exports.getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'recentlyViewed', select: 'name price discountPrice images ratings', options: { limit: 10 } });
  res.json({ success: true, products: user.recentlyViewed });
});

exports.compareProducts = asyncHandler(async (req, res) => {
  const ids = req.query.ids?.split(',');
  if (!ids || ids.length < 2) { res.status(400); throw new Error('Provide at least 2 IDs'); }
  const products = await Product.find({ _id: { $in: ids } }).populate('category', 'name');
  res.json({ success: true, products });
});

exports.stockAlert = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (!user.stockAlerts.includes(req.params.id)) user.stockAlerts.push(req.params.id);
  await user.save();
  res.json({ success: true, message: `We'll notify you when ${product.name} is back!` });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const images = req.files?.map(f => ({ public_id: f.filename, url: f.path })) || [];
  const product = await Product.create({ ...req.body, images });
  res.status(201).json({ success: true, product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (req.files?.length) req.body.images = [...(product.images || []), ...req.files.map(f => ({ public_id: f.filename, url: f.path }))];
  const wasOutOfStock = product.stock === 0;
  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (wasOutOfStock && product.stock > 0) {
    const users = await User.find({ stockAlerts: product._id });
    for (const u of users) {
      await sendEmail({ to: u.email, subject: `${product.name} is back in stock!`, html: `<p><strong>${product.name}</strong> is available now! <a href="${process.env.FRONTEND_URL}/products/${product._id}">Buy now →</a></p>` });
    }
    await User.updateMany({ stockAlerts: product._id }, { $pull: { stockAlerts: product._id } });
  }
  res.json({ success: true, product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const existing = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (existing) { existing.rating = rating; existing.comment = comment; }
  else product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.updateRatings();
  await product.save();
  res.json({ success: true, message: 'Review submitted' });
});

exports.getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8).populate('category', 'name');
  res.json({ success: true, products });
});

exports.bulkImport = asyncHandler(async (req, res) => {
  const { products } = req.body;
  if (!products?.length) { res.status(400); throw new Error('No products'); }
  const created = await Product.insertMany(products, { ordered: false });
  res.status(201).json({ success: true, count: created.length });
});
