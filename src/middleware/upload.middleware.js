const multer = require("multer");

/* ================= MEMORY STORAGE ================= */
const storage = multer.memoryStorage();

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
