const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= CORS (PRODUCTION SAFE) ================= */
const allowedOrigins = [
  "http://localhost:3000", // local frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman / mobile apps
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

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.resolve("uploads")));

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/books", require("./routes/book.routes"));
app.use("/api/admin", require("./routes/admin.book.routes"));
app.use("/api/orders", require("./routes/order.routes"));

/* ================= GLOBAL ERROR (CORS) ================= */
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked" });
  }
  next(err);
});

module.exports = app;
