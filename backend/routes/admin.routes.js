const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/admin.controller");
const { protect, admin } = require("../middleware/auth.middleware");

router.get("/dashboard", protect, admin, getDashboardStats);

module.exports = router;