const Expense = require("../models/expenseModel");

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { groupId, paidBy, amount, splitAmong } = req.body;

    const expense = new Expense({
      groupId,
      paidBy,
      amount,
      splitAmong
    });

    await expense.save();

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};