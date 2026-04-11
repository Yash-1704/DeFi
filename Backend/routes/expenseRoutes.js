const express = require("express");
const router  = express.Router();
const ec      = require("../controllers/expenseController");

router.post("/",                   ec.addExpense);   // POST /api/expenses
router.get("/:groupId",            ec.getExpenses);  // GET  /api/expenses/:groupId
router.get("/:groupId/balances",   ec.getBalances);  // GET  /api/expenses/:groupId/balances

module.exports = router;