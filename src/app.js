const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { verifyToken } = require("./middlewares/auth.js");

const app = express();

/* ================= CORS (PRODUCTION + LOCAL SAFE) ================= */
const allowedOrigins = [
  "http://localhost:3000",
  "https://publisher.sushodh.com",
  "https://sushodh-publisher-frontend.vercel.app",
  "https://sushodh.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  }),
);

/* ================= BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES (UPLOADS) ================= */
const uploadPath = path.join(__dirname, "..", "uploads");
const booksUploadPath = path.join(uploadPath, "books");

/* ENSURE UPLOAD DIRECTORIES EXIST (PRODUCTION SAFE) */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

if (!fs.existsSync(booksUploadPath)) {
  fs.mkdirSync(booksUploadPath);
}

/* Serve uploads */
app.use("/uploads", express.static(uploadPath));
console.log("Serving uploads from:", uploadPath);

/* =========================================================
   PUBLIC ROUTES (NO AUTH REQUIRED)
========================================================= */
app.use("/api/contact", require("./routes/contact.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/books", require("./routes/book.routes"));

/* =========================================================
   AUTH MIDDLEWARE (APPLIED AFTER PUBLIC ROUTES)
========================================================= */
app.use(verifyToken);

/* =========================================================
   PROTECTED ROUTES (AUTH REQUIRED)
========================================================= */
app.use("/api/admin", require("./routes/admin.book.routes"));
app.use("/api/orders", require("./routes/order.routes"));

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  // Multer (file upload) errors → JSON
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        err.message ||
        "File upload error (only jpg, png, webp allowed, max 5MB)",
    });
  }

  // Custom errors
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }

  next(err);
});

/* ================= FINAL ERROR FALLBACK ================= */
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked" });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
});

module.exports = app;
