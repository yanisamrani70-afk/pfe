const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY"); // استبدل بمفتاحك
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [decoded.id]);
    req.user = result.rows[0]; // user موجود في كل Route
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth;