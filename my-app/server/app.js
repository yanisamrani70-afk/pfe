const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* MIDDLEWARES*/
app.use(cors());
app.use(express.json());

/* Database Connection */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "refund_db",
  password: "1234",
  port: 5432,
});

/*  Test DB connection */
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Error connecting to database", err.stack);
  }
  console.log("✅ Database connected successfully!");
  release();
});

/*  Test Route */
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

/* ✅Insert Refund */
app.post("/api/refund", async (req, res) => {
  console.log("Received Data:", req.body); // مهم باش نشوفو واش يستقبل

  const {
    full_name,
    customer_identifier,
    transaction_number,
    payment_date,
    amount,
    reason,
    phone,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO refund_requests 
      (full_name, customer_identifier, transaction_number, payment_date, amount, reason, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        full_name,
        customer_identifier,
        transaction_number,
        payment_date,
        amount,
        reason,
        phone,
      ]
    );

    res.json({ message: "✅ Refund request saved successfully!" });
  } catch (error) {
    console.error("❌ Insert Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//show table demonde de romborsemont
app.get("/api/demandes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM refund_requests ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
//show table double paiment
// app.js
app.get("/api/double-payments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*
      FROM payments p
      JOIN (
        SELECT customer_identifier, amount, payment_date
        FROM payments
        GROUP BY customer_identifier, amount, payment_date
        HAVING COUNT(*) > 1
      ) dup
      ON p.customer_identifier = dup.customer_identifier
      AND p.amount = dup.amount
      AND p.payment_date = dup.payment_date
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



/* ✅ Start Server */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});