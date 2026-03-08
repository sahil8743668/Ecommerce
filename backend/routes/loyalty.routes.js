// loyalty.routes.js
const express = require('express');
const r1 = express.Router();
const lc = require('../controllers/loyalty.controller');
const { protect } = require('../middleware/auth.middleware');
r1.get('/', protect, lc.getLoyalty);
r1.get('/calculate', protect, lc.calculateRedeem);
module.exports = r1;
