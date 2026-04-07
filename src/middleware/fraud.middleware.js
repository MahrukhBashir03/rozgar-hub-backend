const User = require("../models/User");

// ── Suspicious Email Patterns ─────────────────────────────────
const SUSPICIOUS_EMAIL_PATTERNS = [
  /^[a-z]{1,2}\d{6,}@/i,           // very short name + many numbers: a123456@
  /(.)\1{4,}/,                       // repeated chars: aaaaa@
  /^(test|fake|dummy|temp|spam)/i,   // starts with test/fake etc
  /\d{8,}@/,                         // 8+ digits before @
];

const isSuspiciousEmail = (email) => {
  return SUSPICIOUS_EMAIL_PATTERNS.some(pattern => pattern.test(email));
};

// ── Suspicious Name Patterns ──────────────────────────────────
const isSuspiciousName = (name) => {
  if (!name) return true;
  if (name.trim().length < 3) return true;                    // too short
  if (/\d{3,}/.test(name)) return true;                       // 3+ digits in name
  if (/^(.)\1+$/.test(name.replace(/\s/g, ""))) return true;  // all same char: aaaa
  if (/[<>{}[\]\\\/]/.test(name)) return true;                // special chars
  return false;
};

// ── CNIC Format & Duplicate Check ────────────────────────────
const validateCNIC = async (cnic, excludeId = null) => {
  // Format check
  if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
    return { valid: false, reason: "Invalid CNIC format. Use: 12345-1234567-1" };
  }

  // Known fake CNICs
  const FAKE_CNICS = [
    "00000-0000000-0",
    "11111-1111111-1",
    "12345-1234567-1",
    "99999-9999999-9",
  ];
  if (FAKE_CNICS.includes(cnic)) {
    return { valid: false, reason: "This CNIC appears to be invalid or test data." };
  }

  // Duplicate check
  const query = { cnic };
  if (excludeId) query._id = { $ne: excludeId };
  const existing = await User.findOne(query);
  if (existing) {
    return { valid: false, reason: "This CNIC is already registered." };
  }

  return { valid: true };
};

// ── Phone Validation ──────────────────────────────────────────
const validatePhone = async (phone, excludeId = null) => {
  if (!phone) return { valid: true }; // phone is optional

  // Must be Pakistani format: 03XXXXXXXXX
  if (!/^03\d{9}$/.test(phone)) {
    return { valid: false, reason: "Phone must be Pakistani format: 03XXXXXXXXX" };
  }

  // Duplicate check
  const query = { phone };
  if (excludeId) query._id = { $ne: excludeId };
  const existing = await User.findOne(query);
  if (existing) {
    return { valid: false, reason: "This phone number is already registered." };
  }

  return { valid: true };
};

// ── Main Fraud Detection Middleware ──────────────────────────
// Use on register routes
const detectFraud = async (req, res, next) => {
  try {
    const { name, email, cnic, phone } = req.body;

    const flags = [];

    // 1. Suspicious email
    if (email && isSuspiciousEmail(email)) {
      flags.push("Suspicious email pattern detected.");
    }

    // 2. Suspicious name
    if (isSuspiciousName(name)) {
      flags.push("Invalid or suspicious name.");
    }

    // 3. CNIC validation
    if (cnic) {
      const cnicCheck = await validateCNIC(cnic);
      if (!cnicCheck.valid) {
        return res.status(400).json({ error: cnicCheck.reason });
      }
    }

    // 4. Phone validation
    if (phone) {
      const phoneCheck = await validatePhone(phone);
      if (!phoneCheck.valid) {
        return res.status(400).json({ error: phoneCheck.reason });
      }
    }

    // 5. If multiple flags — block registration
    if (flags.length >= 2) {
      console.warn(`🚨 Fraud attempt blocked — IP: ${req.ip}, flags: ${flags.join(", ")}`);
      return res.status(400).json({
        error: "Registration blocked due to suspicious activity. Please contact support.",
      });
    }

    // 6. Single flag — allow but log warning
    if (flags.length === 1) {
      console.warn(`⚠️  Suspicious registration — IP: ${req.ip}, flag: ${flags[0]}`);
      req.fraudWarning = flags[0];
    }

    next();

  } catch (err) {
    console.error("Fraud detection error:", err.message);
    next(); // Don't block on error — just continue
  }
};

module.exports = { detectFraud, validateCNIC, validatePhone, isSuspiciousEmail };