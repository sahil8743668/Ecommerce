const express = require('express');
const r = express.Router();
const c = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth.middleware');

r.post('/', protect, c.createOrder);
r.get('/my-orders', protect, c.getMyOrders);
r.get('/admin/stats', protect, admin, c.getAdminStats);
r.get('/', protect, admin, c.getAllOrders);
r.get('/:id', protect, c.getOrder);
r.put('/:id/pay', protect, c.updateOrderToPaid);
r.put('/:id/status', protect, admin, c.updateOrderStatus);
r.post('/:id/reorder', protect, c.reorder);

module.exports = r;
