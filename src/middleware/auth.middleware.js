// module.exports = (req, res, next) => {
//   next();
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Verify JWT Token ──────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB — ensures deleted/banned users can't access
    const user = await User.findById(decoded.id).select("-password -otp");
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: "Email not verified. Please verify your email first." });
    }

    req.user = user;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    return res.status(500).json({ error: "Authentication failed." });
  }
};

// ── Role Check — only allow specific roles ────────────────────
// Usage: requireRole("employer") or requireRole("worker", "employer")
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Access denied. Only ${roles.join(" or ")} can access this route.`
    });
  }
  next();
};

// ── Optional Auth — attaches user if token present, doesn't fail ──
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -otp");
    if (user) req.user = user;
  } catch (_) {}
  next();
};

module.exports = { verifyToken, requireRole, optionalAuth };