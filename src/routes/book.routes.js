const express = require("express");
const {
  getAllBooks,
  getBookBySlug,
  getFeaturedBooks,
} = require("../controllers/book.controller");

const router = express.Router();

/* ================= PUBLIC: FEATURED BOOKS ================= */
router.get("/featured", getFeaturedBooks);

/* ================= PUBLIC: ALL ACTIVE BOOKS ================= */
router.get("/", getAllBooks);

/* ================= PUBLIC: SINGLE BOOK BY SLUG ================= */
router.get("/:slug", getBookBySlug);

module.exports = router;
