
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
//import { createClient } from "@supabase/supabase-js/dist/index.cjs";

const app = express();

/* MIDDLEWARES*/
/*
app.use(cors());
app.use(express.json());

 Database Connection 

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "refund_db",
  password: "1234",
  port: 5432,
});

//
const supabase=createClient(
  'https://vtegyvnfqtydhzmplquq.supabase.co',
  'sb_publishable_9U2afcU4yIA4Tw4DtR7LTg_OJeYuDIN'
)
async function getPayments() {
  const { data, error } = await supabase.from('payments').select('*')
  if (error) console.error('Error:', error)
  else console.log('Payments:', data)
}

getPayments()





const pool = new Pool({
  connectionString: "postgres:yanis jsk db@db.vtegyvnfqtydhzmplquq.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }

})

pool.connect()
  .then(() => console.log("✅ Connected to Supabase DB"))
  .catch(err => console.error("❌ Error connecting to database", err))

module.exports = pool
//

  //Test DB connection 
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Error connecting to database", err.stack);
  }
  console.log("✅ Database connected successfully!");
  release();
});

//Test Route 
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});
//test
app.get("/get",  (req, res) => {
  
    
    res.send("ok")
  
});


// ✅Insert Refund 
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
 SELECT *
    FROM payments
    WHERE (customer_identifier, amount, payment_date) IN (
      SELECT customer_identifier, amount, payment_date
      FROM payments
      GROUP BY customer_identifier, amount, payment_date
      HAVING COUNT(*) > 1
    )

    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// agent aprover et envoyer vers le finance
// Approve a refund request
app.post("/api/approve", async (req, res) => {
  const {
    id,
    full_name,
    customer_identifier,
    transaction_number,
    payment_date,
    amount,
    phone,
  } = req.body;

  if (!id || !full_name || !customer_identifier) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Insert into approved_refunds
    await pool.query(
      `
      INSERT INTO approved_refunds
      (full_name, customer_identifier, transaction_number, payment_date, amount, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [full_name, customer_identifier, transaction_number, payment_date, amount, phone]
    );

    // 2️⃣ Update the refund_requests status
    await pool.query(
      `
      UPDATE refund_requests
      SET status = 'approved'
      WHERE id = $1
      `,
      [id]
    );

    res.json({ message: "✅ Refund request approved and saved" });
  } catch (error) {
    console.error("❌ Approve Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// GET all approved refunds finance
app.get("/api/approved-refunds", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM approved_refunds ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching approved refunds:", err);
    res.status(500).json({ error: "Server error" });
  }
});
//get function caissier data
app.get("/api/caissier", async (req, res) => {
  try {
    const result = await pool.query(`
   SELECT 
   id,
   name, 
   
   customer_id, 
    bl, 

    transaction_number, 
    amount,

   payment_date, 
   status
  FROM caissier_table
   ORDER BY payment_date DESC
  `);

    res.json(result.rows);
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).send("Server error");
  }
});



// api post ta3 test
app.post("/api/caissier-post", async (req, res) => {
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: "No items selected" });
  }

  try {
    // Correctly extract IDs from the items array
    const ids = items.map((item) => item.id);

    const query = `
      UPDATE caissier_table 
      SET status = 'approved' 
      WHERE id = ANY($1)
    `;

 await pool.query(query, [ids]);

 res.json({ message: "Payments updated successfully" });
  } catch (error) {
    console.error("Database Error:", error.message); 
    res.status(500).json({ error: "Database failed to update" });
  }
});

//✅ Start Server 
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

*/