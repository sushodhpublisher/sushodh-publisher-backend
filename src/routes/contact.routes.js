const express = require("express");
const { sendContactMail } = require("../controllers/contact.controller");

const router = express.Router();

/* ================= PUBLIC CONTACT ================= */
router.post("/", sendContactMail);

module.exports = router;
