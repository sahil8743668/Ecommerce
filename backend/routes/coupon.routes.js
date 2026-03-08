// coupon.routes.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/coupon.controller');
const { protect, admin } = require('../middleware/auth.middleware');
router.post('/validate', protect, c.validateCoupon);
router.get('/', protect, admin, c.getAllCoupons);
router.post('/', protect, admin, c.createCoupon);
router.put('/:id', protect, admin, c.updateCoupon);
router.delete('/:id', protect, admin, c.deleteCoupon);
module.exports = router;
