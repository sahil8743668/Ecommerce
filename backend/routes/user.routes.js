const express = require('express');
const r = express.Router();
const c = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

r.get('/recently-viewed', protect, require('../controllers/product.controller').getRecentlyViewed);
r.put('/profile', protect, c.updateProfile);
r.post('/avatar', protect, upload.single('avatar'), c.uploadAvatar);
r.put('/change-password', protect, c.changePassword);
r.post('/wishlist/:productId', protect, c.toggleWishlist);
r.post('/address', protect, c.addAddress);
r.put('/address/:addressId', protect, c.updateAddress);
r.delete('/address/:addressId', protect, c.deleteAddress);
r.get('/', protect, admin, c.getAllUsers);
r.delete('/:id', protect, admin, c.deleteUser);

module.exports = r;
