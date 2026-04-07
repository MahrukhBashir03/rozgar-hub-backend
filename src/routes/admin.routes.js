const express = require("express");
const router  = express.Router();

const {
  getAllUsers,
  verifyUser,
  unverifyUser,
  deleteUser,
  getStats,
} = require("../controllers/admin.controller");

// ── Stats ──────────────────────────────────────────────────
router.get("/stats", getStats);

// ── Users ──────────────────────────────────────────────────
router.get("/users",              getAllUsers);
router.patch("/users/:id/verify",   verifyUser);
router.patch("/users/:id/unverify", unverifyUser);
router.delete("/users/:id",         deleteUser);

module.exports = router;