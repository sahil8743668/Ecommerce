const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/recommendation.controller");

router.get("/:id", getRecommendations);

module.exports = router;