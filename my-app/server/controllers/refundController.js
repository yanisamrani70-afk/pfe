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