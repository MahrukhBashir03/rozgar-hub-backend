const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  registerWorker,
  registerEmployer,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const { uploadWorkerDocs, uploadEmployerDocs } = require("../middleware/upload.middleware");
const { detectFraud } = require("../middleware/fraud.middleware");

// ── Rate Limiters ─────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { error: "Too many OTP requests. Try again after 10 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many registration attempts. Try again after 1 hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Worker Register ───────────────────────────────────────────
// Order: registerLimiter → multer (parses files + body) → detectFraud → controller
router.post("/register/worker",
  registerLimiter,
  uploadWorkerDocs,
  detectFraud,
  registerWorker
);

// ── Employer Register ─────────────────────────────────────────
router.post("/register/employer",
  registerLimiter,
  uploadEmployerDocs,
  detectFraud,
  registerEmployer
);

// ── OTP ───────────────────────────────────────────────────────
router.post("/verify-otp",      otpLimiter, verifyOTP);
router.post("/resend-otp",      otpLimiter, resendOTP);

// ── Login ─────────────────────────────────────────────────────
router.post("/login",           loginLimiter, login);

// ── Password Reset ────────────────────────────────────────────
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password",  otpLimiter, resetPassword);

module.exports = router;