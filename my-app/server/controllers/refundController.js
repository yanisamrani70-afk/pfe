const pool = require("../config/db");

/* Insert Refund */
exports.createRefund = async (req, res) => {
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
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
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

    res.json({ message: "Refund saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/* Get refund requests */
exports.getDemandes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM refund_requests ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/* Double payments */
exports.getDoublePayments = async (req, res) => {
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
    res.status(500).json({ error: "Server error" });
  }
};

/* Approve refund */
exports.approveRefund = async (req, res) => {
  const {
    id,
    full_name,
    customer_identifier,
    transaction_number,
    payment_date,
    amount,
    phone,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO approved_refunds
      (full_name, customer_identifier, transaction_number, payment_date, amount, phone)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        full_name,
        customer_identifier,
        transaction_number,
        payment_date,
        amount,
        phone,
      ]
    );

    await pool.query(
      `UPDATE refund_requests
       SET status='approved'
       WHERE id=$1`,
      [id]
    );

    res.json({ message: "Refund approved" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/* Approved refunds */
exports.getApprovedRefunds = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM approved_refunds ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
//get function caissier data

  exports.getcassierdata= async (req, res) => {
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
};



// api post ta3 test

   exports.testapicassier=  async (req, res) => {
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
};

//function ta3 http://localhost:5000/api/caissiersend
/*
exports.caissiersend = async (req, res) => {
  const {
    name,
    customer_id,
    bl,
    transaction_number,
    payment_date,
    amount,
    status
  } = req.body;

  try {
    if (!customer_id || !bl || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await pool.query(
      `INSERT INTO caissier_table
      (name, customer_id, bl, transaction_number, payment_date, amount, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        name,
        customer_id,
        bl,
        transaction_number,
        payment_date,
        amount,
        status
      ]
    );

    res.json({ message: "Inserted into caissier_table successfully" });
  } catch (error) {
    console.error("Insert Cassier Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
*/
exports.caissiersend=async(req, res) => {
  try {
    let { name, bl, transaction_number, amount, payment_date } = req.body;

    console.log("Received body:", req.body);

    if (!name || !bl || !transaction_number || !amount || !payment_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber)) return res.status(400).json({ error: "Invalid amount" });

    console.log("Fetching customer_id for:", { name, bl, amount: amountNumber });

    const idResult = await pool.query(
      `SELECT customer_identifier FROM approved_refunds
       WHERE full_name = $1 AND bl = $2 AND amount = $3
       LIMIT 1`,
      [name, bl, amountNumber]
    );

    console.log("Customer_id result:", idResult.rows);

    if (idResult.rows.length === 0) {
      return res.status(400).json({ error: "No matching approved refund found to get client ID" });
    }

    const customer_id = idResult.rows[0].customer_identifier;

    const existing = await pool.query(
      `SELECT * FROM caissier_table WHERE name = $1 AND bl = $2 AND amount = $3`,
      [name, bl, amountNumber]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "This payment already exists in caissier_table ❌" });
    }

    await pool.query(
      `INSERT INTO caissier_table
       (name, customer_id, bl, transaction_number, amount, payment_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, customer_id, bl, transaction_number, amountNumber, payment_date, "Pending"]
    );

    res.json({ message: "Inserted into caissier_table with status Pending ✅" });

  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//app.get("/api/download-csv", 
 const path = require("path");
const fs = require("fs");

exports.download_csv = (req, res) => {
  const filePath = path.join(__dirname, "../test.csv");

  // check file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, "test.csv", (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Download failed" });
    }
  });
};