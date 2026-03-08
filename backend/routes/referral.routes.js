const express = require('express');
const router = express.Router();
const { getMyReferral } = require('../controllers/referral.controller');
const { protect } = require('../middleware/auth.middleware');
router.get('/my-code', protect, getMyReferral);
module.exports = router;
