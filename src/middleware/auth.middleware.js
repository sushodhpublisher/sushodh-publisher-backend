const jwt = require("jsonwebtoken");

/* ================= VERIFY JWT TOKEN ================= */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= ADMIN CHECK ================= */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const role = String(req.user.role || "").toLowerCase();

  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};
