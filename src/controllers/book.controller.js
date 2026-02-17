const Book = require("../models/Book");
const slugify = require("slugify");
const mongoose = require("mongoose");

/* ================= HELPERS ================= */
const toBoolean = (val) => val === true || val === "true";

const parseAuthors = (rawAuthors) => {
  let authors = [];

  if (!rawAuthors) return [];

  if (typeof rawAuthors === "string") {
    try {
      const parsed = JSON.parse(rawAuthors);
      if (Array.isArray(parsed)) {
        authors = parsed;
      } else {
        authors = [rawAuthors];
      }
    } catch {
      authors = rawAuthors.split(",");
    }
  }

  if (Array.isArray(rawAuthors)) {
    authors = rawAuthors;
  }

  return authors.map((a) => a.trim()).filter(Boolean);
};

/* =====================================================
   ADMIN: CREATE BOOK
===================================================== */

exports.createBook = async (req, res) => {
  try {
    const { title, description, price, coverImage } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        message: "Title, description and price are required",
      });
    }

    if (!coverImage) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({
        message: "Price must be a valid number",
      });
    }

    const authors = parseAuthors(req.body.authors);

    if (!authors.length) {
      return res.status(400).json({
        message: "At least 1 valid author is required",
      });
    }

    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

    const book = await Book.create({
      title,
      slug,
      price: numericPrice,
      description,
      isActive: toBoolean(req.body.isActive),
      isFeatured: toBoolean(req.body.isFeatured),
      authors,
      coverImage, // 👈 URL from frontend
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Create Book Error:", error);
    res.status(500).json({
      message: error.message || "Server error while saving book",
    });
  }
};

/* =====================================================
   ADMIN: UPDATE BOOK
===================================================== */

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updateData = {};

    if (req.body.title) {
      updateData.title = req.body.title;
    }

    if (req.body.description) {
      updateData.description = req.body.description;
    }

    if (req.body.price !== undefined) {
      const numericPrice = Number(req.body.price);
      if (isNaN(numericPrice)) {
        return res.status(400).json({
          message: "Price must be a valid number",
        });
      }
      updateData.price = numericPrice;
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = toBoolean(req.body.isActive);
    }

    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = toBoolean(req.body.isFeatured);
    }

    if (req.body.authors !== undefined) {
      const authors = parseAuthors(req.body.authors);

      if (!authors.length) {
        return res.status(400).json({
          message: "At least 1 valid author is required",
        });
      }

      updateData.authors = authors;
    }

    if (req.body.coverImage) {
      updateData.coverImage = req.body.coverImage;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Update Book Error:", error);
    res.status(500).json({
      message: "Server error while updating book",
    });
  }
};

/* =====================================================
   ADMIN: DELETE BOOK
===================================================== */

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete Book Error:", error);
    res.status(500).json({
      message: "Failed to delete book",
    });
  }
};

/* =====================================================
   ADMIN: GET ALL BOOKS
===================================================== */

exports.getAllBooksForAdmin = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(books);
  } catch (error) {
    console.error("Admin Get All Books Error:", error);
    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

/* =====================================================
   ADMIN: GET BOOK BY ID
===================================================== */

exports.getBookByIdForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Admin Get Book Error:", error);
    res.status(500).json({
      message: "Failed to fetch book",
    });
  }
};

/* =====================================================
   ADMIN: TOGGLE FEATURED
===================================================== */

exports.toggleFeaturedBook = async (req, res) => {
  try {
    const { id } = req.params;
    let { isFeatured } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    if (typeof isFeatured === "string") {
      isFeatured = isFeatured === "true";
    }

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        message: "Invalid payload: isFeatured must be boolean",
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (isFeatured && !book.isActive) {
      return res
        .status(400)
        .json({ message: "Inactive book cannot be featured" });
    }

    book.isFeatured = isFeatured;
    await book.save();

    res.status(200).json({ success: true, isFeatured });
  } catch (error) {
    console.error("Toggle Featured Error:", error);
    res.status(500).json({
      message: "Failed to update featured status",
    });
  }
};

/* =====================================================
   ADMIN: TOGGLE ACTIVE
===================================================== */

exports.toggleActiveBook = async (req, res) => {
  try {
    const { id } = req.params;
    let { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    if (typeof isActive === "string") {
      isActive = isActive === "true";
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "Invalid payload: isActive must be boolean",
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.isActive = isActive;

    if (!isActive) {
      book.isFeatured = false;
    }

    await book.save();

    res.status(200).json({
      success: true,
      isActive,
      isFeatured: book.isFeatured,
    });
  } catch (error) {
    console.error("Toggle Active Error:", error);
    res.status(500).json({
      message: "Failed to update active status",
    });
  }
};

/* =====================================================
   PUBLIC APIs
===================================================== */

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(books);
  } catch {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

exports.getBookBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const book = await Book.findOne({ slug, isActive: true }).lean();

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch {
    res.status(500).json({ message: "Failed to fetch book" });
  }
};

exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(books);
  } catch {
    res.status(500).json({ message: "Failed to fetch featured books" });
  }
};
