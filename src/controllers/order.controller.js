const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * IMPORTANT:
 * This file lives at:
 * backend/src/middleware/upload.middleware.js
 *
 * uploads folder lives at:
 * backend/uploads/books
 *
 * We MUST resolve absolute path from project root
 * to work correctly on Render.
 */

/* ================= ABSOLUTE UPLOAD PATH ================= */
const uploadPath = path.resolve(
  __dirname,
  "..", // src
  "..", // backend
  "uploads",
  "books",
);

/* ================= ENSURE DIRECTORY EXISTS ================= */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("Created upload directory:", uploadPath);
} else {
  console.log("Upload directory exists:", uploadPath);
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // ABSOLUTE PATH (CRITICAL FIX)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueName}${ext}`);
  },
});

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only image files (jpg, png, webp) are allowed"),
      false,
    );
  }

  cb(null, true);
};

/* ================= MULTER INSTANCE ================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
