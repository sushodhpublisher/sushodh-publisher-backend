const express = require("express");
const {
  createBook,
  toggleFeaturedBook,
  toggleActiveBook,
  getAllBooksForAdmin,
  deleteBook,
  getBookByIdForAdmin,
  updateBook,
} = require("../controllers/book.controller");

const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

/* ================= ADMIN: GET ALL BOOKS ================= */
router.get(
  "/books",
  verifyToken,
  isAdmin,
  (req, res, next) => {
    res.set("Cache-Control", "no-store"); // ✅ ensure fresh admin data
    next();
  },
  getAllBooksForAdmin,
);

/* ================= ADMIN: GET SINGLE BOOK ================= */
router.get("/books/:id", verifyToken, isAdmin, getBookByIdForAdmin);

/* ================= ADMIN: CREATE BOOK ================= */
router.post(
  "/books",
  verifyToken,
  isAdmin,
  upload.single("coverImage"),
  createBook,
);

/* ================= ADMIN: UPDATE BOOK ================= */
router.put(
  "/books/:id",
  verifyToken,
  isAdmin,
  upload.single("coverImage"),
  updateBook,
);

/* ================= ADMIN: TOGGLE FEATURED ================= */
router.patch("/books/:id/featured", verifyToken, isAdmin, toggleFeaturedBook);

/* ================= ADMIN: TOGGLE ACTIVE ================= */
router.patch("/books/:id/active", verifyToken, isAdmin, toggleActiveBook);

/* ================= ADMIN: DELETE BOOK ================= */
router.delete("/books/:id", verifyToken, isAdmin, deleteBook);

module.exports = router;
