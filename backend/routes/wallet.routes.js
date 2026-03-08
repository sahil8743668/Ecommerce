const express = require('express');
const router = express.Router();
const c = require('../controllers/wallet.controller');
const { protect, admin } = require('../middleware/auth.middleware');
router.get('/', protect, c.getWallet);
router.post('/credit', protect, admin, c.creditWallet);
module.exports = router;
