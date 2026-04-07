const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
