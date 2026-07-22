const express = require("express");
const { adminLogin } = require("../controllers/auth.controller");
const { loginLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/admin/login", loginLimiter, adminLogin);

module.exports = router;
