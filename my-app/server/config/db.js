const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "refund_db",
  password: "imadorb",
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Error connecting to database", err.stack);
  }
  console.log("✅ Database connected successfully!");
  release();
});

module.exports = pool;