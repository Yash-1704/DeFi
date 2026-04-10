const express = require("express");
const router = express.Router();

const {
  addTransaction,
  getTransactions,
} = require("../controllers/transactionController");

router.post("/add", addTransaction);
router.get("/:address", getTransactions);

module.exports = router;