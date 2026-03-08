const express = require('express');
const r = express.Router();
const c = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

r.get('/', c.getProducts);
r.get('/featured', c.getFeatured);
r.get('/compare', c.compareProducts);
r.get('/:id', c.getProduct);
r.get('/:id/recommended', c.getRecommended);
r.post('/:id/stock-alert', protect, c.stockAlert);
r.post('/:id/review', protect, c.addReview);
r.post('/', protect, admin, upload.array('images', 5), c.createProduct);
r.post('/bulk-import', protect, admin, c.bulkImport);
r.put('/:id', protect, admin, upload.array('images', 5), c.updateProduct);
r.delete('/:id', protect, admin, c.deleteProduct);

module.exports = r;
