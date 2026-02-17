const express = require("express");
const cors = require("cors");

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

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/books", require("./routes/book.routes"));
app.use("/api/admin", require("./routes/admin.book.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked" });
  }

  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
