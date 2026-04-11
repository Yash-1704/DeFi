const Expense   = require("../models/expenseModel");
const Group     = require("../models/groupModel");
const { calculateSettlement } = require("../services/splitServices");

// ── Add expense ────────────────────────────────────────────────
exports.addExpense = async (req, res) => {
  try {
    const { groupId, paidBy, amount, splitAmong, description } = req.body;
    if (!groupId || !paidBy || !amount || !splitAmong?.length) {
      return res.status(400).json({ error: "groupId, paidBy, amount and splitAmong are required" });
    }

    const expense = new Expense({
      groupId,
      description: description || "",
      paidBy: paidBy.toLowerCase(),
      amount: parseFloat(amount),
      splitAmong: splitAmong.map(a => a.toLowerCase()),
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Get all expenses for a group ───────────────────────────────
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId })
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Calculate net balances for a group ────────────────────────
exports.getBalances = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const expenses = await Expense.find({ groupId: req.params.groupId });

    // Build full balances map
    const balances = {};
    group.members.forEach(m => { balances[m.toLowerCase()] = 0; });

    expenses.forEach(exp => {
      const share = exp.amount / (exp.splitAmong.length || 1);
      const payer = exp.paidBy.toLowerCase();
      if (balances[payer] === undefined) balances[payer] = 0;
      balances[payer] += exp.amount;
      exp.splitAmong.forEach(addr => {
        const a = addr.toLowerCase();
        if (balances[a] === undefined) balances[a] = 0;
        balances[a] -= share;
      });
    });

    // Round to 6dp to remove floating-point noise
    Object.keys(balances).forEach(k => {
      balances[k] = parseFloat(balances[k].toFixed(6));
    });

    res.json({ balances, memberCount: group.members.length, expenseCount: expenses.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
