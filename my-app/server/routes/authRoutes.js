const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // لقراءة المتغيرات من .env

const router = express.Router();

// Dummy users (مؤقت قبل استخدام قاعدة البيانات)
const users = [
  { id: 1, email: "agent@test.com", password: "1234", role: "agent" },
  { id: 2, email: "finance@test.com", password: "1234", role: "finance" },
  { id: 3, email: "cassier@test.com", password: "1234", role: "cassier" },
];

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // ابحث عن المستخدم
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // إنشاء JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role });
});

module.exports = router;