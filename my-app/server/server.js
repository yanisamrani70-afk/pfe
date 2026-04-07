const express = require("express");
const cors = require("cors");

const refundRoutes = require("./routes/refundRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", refundRoutes);

app.get("/", (req, res) => {
  res.send("Server working");
});


//role  31 /03/
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// bash tmshi schedular1.js
require("./config/schedular1");