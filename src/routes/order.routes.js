const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/order.controller");
const { orderLimiter } = require("../middleware/rateLimit.middleware");

router.post("/", orderLimiter, createOrder);

module.exports = router;
