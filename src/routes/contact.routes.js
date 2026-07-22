const express = require("express");
const { sendContactMail } = require("../controllers/contact.controller");
const { contactLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/", contactLimiter, sendContactMail);

module.exports = router;
