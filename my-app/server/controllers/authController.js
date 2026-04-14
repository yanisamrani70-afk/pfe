const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// 
exports.login = async (req, res) => {
   const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    const user = result.rows[0];

    if (!user || user.password !== password) { // لاحقًا استبدل bcrypt
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // إنشاء Token
    const token = jwt.sign(
      { id: user.id }, // بيانات مخزنة في Token
      "YOUR_SECRET_KEY", // استبدل بمفتاحك السري
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};