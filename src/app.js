const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();

/* ================= CORS (PRODUCTION + LOCAL SAFE) ================= */
const allowedOrigins = [
  "http://localhost:3000",
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
const possibleUploadPaths = [
  path.join(process.cwd(), "uploads"),
  path.join(__dirname, "uploads"),
  path.join(__dirname, "..", "uploads"),
];

const uploadPath = possibleUploadPaths.find((p) => fs.existsSync(p));

if (!uploadPath) {
  console.error("uploads folder NOT FOUND in any expected location");
} else {
  console.log("Serving uploads from:", uploadPath);
  app.use("/uploads", express.static(uploadPath));
}

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/books", require("./routes/book.routes"));
app.use("/api/admin", require("./routes/admin.book.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

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

  // Custom errors (like fileFilter)
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }

  next(err);
});

/* ================= GLOBAL ERROR (CORS FALLBACK) ================= */
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked" });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
});

module.exports = app;
