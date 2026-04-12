const express = require("express");
const router = express.Router();

const refundController = require("../controllers/refundController");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const authController = require("../controllers/authController");

// تسجيل الدخول
router.post("/login", authController.login);

// Routes للـ Agent
router.get("/demandes", auth, checkRole("agent"), refundController.getDemandes);
router.get("/double-payments", auth, checkRole("agent"), refundController.getDoublePayments);
router.post("/approve", auth, checkRole("agent"), refundController.approveRefund);

// Routes للـ Cassier
router.get("/caissier", refundController.getcassierdata);
router.post("/caissier-post", refundController.testapicassier);

// Routes للـ Finance
router.get("/approved-refunds", auth, checkRole("finance", "cassier"), refundController.getApprovedRefunds);
//hada wsh zdt
router.post("/caissiersend", auth, checkRole("finance", "cassier"), refundController.caissiersend);
// Test route protected
router.get("/refunds", auth, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user
  });
});

router.get(
  "/download-csv",
  auth,
  checkRole("finance", "cassier"),
  refundController.download_csv
);

module.exports = router;