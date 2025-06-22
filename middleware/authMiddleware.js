const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIXED: Use userId instead of id
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = auth;
