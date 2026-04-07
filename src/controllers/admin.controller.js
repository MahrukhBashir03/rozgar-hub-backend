const User = require("../models/User");

// ── GET /api/admin/users ──────────────────────────────────────
// Returns all workers and employers with their documents
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ── PATCH /api/admin/users/:id/verify ────────────────────────
// Set isVerified = true for a user
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password -otp -otpExpiry");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User verified successfully", user });
  } catch (err) {
    console.error("verifyUser error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ── PATCH /api/admin/users/:id/unverify ──────────────────────
// Set isVerified = false
exports.unverifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    ).select("-password -otp -otpExpiry");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User unverified", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/admin/users/:id ───────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/admin/stats ─────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [total, workers, employers, verified, pending] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "worker" }),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
    ]);

    res.json({ total, workers, employers, verified, pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};