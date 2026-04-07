const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/sendEmail");

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ─────────────────────────────────────────────────────────────
// WORKER REGISTER
// ─────────────────────────────────────────────────────────────
exports.registerWorker = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    const { name, email, password, phone, cnic } = req.body;

    // Duplicate email check
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      if (!existingEmail.isEmailVerified) {
        const otp = generateOTP();
        existingEmail.otp = await bcrypt.hash(otp, 10);
        existingEmail.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        existingEmail.otpAttempts = 0;
        await existingEmail.save({ validateBeforeSave: false });
        await sendOTPEmail(email, otp, existingEmail.name);
        return res.status(200).json({
          message: "Account not verified. New OTP sent.",
          requiresVerification: true,
          email,
        });
      }
      return res.status(409).json({ error: "Email already registered." });
    }

    // Duplicate CNIC check
    const existingCnic = await User.findOne({ cnic });
    if (existingCnic) {
      return res.status(409).json({ error: "CNIC already registered." });
    }

    // ✅ Hash password manually here — no pre-save hook
    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,   // ✅ already hashed
      phone: phone || null,
      cnic,
      role: "worker",
      otp: hashedOTP,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      isEmailVerified: false,
    });

    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: "Worker registered! Check your email for OTP.",
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) {
    console.error("registerWorker error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// EMPLOYER REGISTER
// ─────────────────────────────────────────────────────────────
exports.registerEmployer = async (req, res) => {
  try {
    const { name, email, password, phone, cnic } = req.body;

    // Duplicate email check
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      if (!existingEmail.isEmailVerified) {
        const otp = generateOTP();
        existingEmail.otp = await bcrypt.hash(otp, 10);
        existingEmail.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        existingEmail.otpAttempts = 0;
        await existingEmail.save({ validateBeforeSave: false });
        await sendOTPEmail(email, otp, existingEmail.name);
        return res.status(200).json({
          message: "Account not verified. New OTP sent.",
          requiresVerification: true,
          email,
        });
      }
      return res.status(409).json({ error: "Email already registered." });
    }

    // Duplicate CNIC check
    const existingCnic = await User.findOne({ cnic });
    if (existingCnic) {
      return res.status(409).json({ error: "CNIC already registered." });
    }

    // ✅ Hash password manually here — no pre-save hook
    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,   // ✅ already hashed
      phone: phone || null,
      cnic,
      role: "employer",
      otp: hashedOTP,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      isEmailVerified: false,
    });

    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: "Employer registered! Check your email for OTP.",
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) {
    console.error("registerEmployer error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// VERIFY OTP
// ─────────────────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+otp +otpExpiry"
    );

    if (!user) {
      return res.status(404).json({ error: "No account found." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Already verified. Please login." });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({ error: "Too many attempts. Request a new OTP." });
    }

    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        error: `Wrong OTP. ${5 - user.otpAttempts} attempts left.`,
      });
    }

    // ✅ Mark verified
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified! Welcome to Rozgar Hub.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("verifyOTP error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// RESEND OTP
// ─────────────────────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+otp +otpExpiry"
    );

    if (!user) return res.status(404).json({ error: "No account found." });
    if (user.isEmailVerified) return res.status(400).json({ error: "Already verified." });

    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (err) {
    console.error("resendOTP error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Not verified → resend OTP
    if (!user.isEmailVerified) {
      const otp = generateOTP();
      user.otp = await bcrypt.hash(otp, 10);
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      await sendOTPEmail(email, otp, user.name);
      return res.status(403).json({
        message: "Email not verified. OTP sent to your email.",
        requiresVerification: true,
        email: user.email,
      });
    }

    // ✅ Compare password with bcrypt directly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// body: { email }
// ─────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "No account found with this email." });

    // Generate OTP
    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({
      message: "OTP sent to your email.",
      email: user.email,
    });
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD
// POST /api/auth/reset-password
// body: { email, otp, newPassword }
// ─────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpiry");

    if (!user) return res.status(404).json({ error: "No account found." });

    if (user.otpAttempts >= 5) {
      return res.status(429).json({ error: "Too many attempts. Request a new OTP." });
    }

    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ error: "OTP expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        error: `Wrong OTP. ${5 - user.otpAttempts} attempts left.`,
      });
    }

    // ✅ OTP verified — update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Password reset successful! You can now login." });
  } catch (err) {
    console.error("resetPassword error:", err.message);
    res.status(500).json({ error: err.message });
  }
};