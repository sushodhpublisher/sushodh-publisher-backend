const Book = require("../models/Book");
const slugify = require("slugify");
const mongoose = require("mongoose");

/* =====================================================
   ADMIN: CREATE BOOK
===================================================== */
exports.createBook = async (req, res) => {
  try {
    const coverImage = req.file ? `/uploads/books/${req.file.filename}` : "";

    let authors = [];
    if (req.body.authors) {
      try {
        authors = JSON.parse(req.body.authors);
      } catch {
        return res.status(400).json({ message: "Invalid authors format" });
      }
    }

    if (!Array.isArray(authors) || authors.length < 1) {
      return res.status(400).json({ message: "At least 1 author is required" });
    }

    authors = authors.map((a) => a.trim()).filter(Boolean);

    const baseSlug = slugify(req.body.title, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

    const book = await Book.create({
      title: req.body.title,
      slug,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive === "true",
      isFeatured: req.body.isFeatured === "true",
      authors,
      coverImage,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   PUBLIC: GET ALL ACTIVE BOOKS
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

/* =====================================================
   PUBLIC: GET BOOK BY SLUG
===================================================== */
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

/* =====================================================
   PUBLIC: FEATURED BOOKS
===================================================== */
exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      isActive: true,
      isFeatured: true,
    })
      .select("title slug price coverImage authors")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(books);
  } catch {
    res.status(500).json({ message: "Failed to fetch featured books" });
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
  } catch {
    res.status(500).json({ message: "Failed to fetch books" });
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
  } catch {
    res.status(500).json({ message: "Failed to fetch book" });
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

    const book = await Book.findById(id).lean();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (isFeatured && !book.isActive) {
      return res
        .status(400)
        .json({ message: "Inactive book cannot be featured" });
    }

    await Book.updateOne({ _id: id }, { $set: { isFeatured } });

    res.status(200).json({ success: true, isFeatured });
  } catch (error) {
    console.error("Toggle Featured Error:", error);
    res.status(500).json({ message: "Failed to update featured status" });
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

    await Book.updateOne(
      { _id: id },
      {
        $set: {
          isActive,
          ...(isActive === false && { isFeatured: false }),
        },
      },
    );

    res.status(200).json({
      success: true,
      isActive,
      isFeatured: isActive ? undefined : false,
    });
  } catch (error) {
    console.error("Toggle Active Error:", error);
    res.status(500).json({ message: "Failed to update active status" });
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

    let authors;

    try {
      authors = req.body.authors ? JSON.parse(req.body.authors) : null;
    } catch {
      return res.status(400).json({ message: "Invalid authors format" });
    }

    if (
      !Array.isArray(authors) ||
      authors.length < 1 ||
      authors.some((a) => !a || !a.trim())
    ) {
      return res.status(400).json({
        message: "At least 1 valid author is required",
      });
    }

    authors = authors.map((a) => a.trim());

    const updateData = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      ...(req.body.isActive !== undefined && {
        isActive: req.body.isActive === "true",
      }),
      ...(req.body.isFeatured !== undefined && {
        isFeatured: req.body.isFeatured === "true",
      }),
      ...(authors && { authors }),
    };

    if (req.file) {
      updateData.coverImage = `/uploads/books/${req.file.filename}`;
    }

    const book = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to update book" });
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

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete book" });
  }
};
