const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  paidBy: {
    type: String, // wallet address
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  splitAmong: [
    {
      type: String // wallet addresses
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", expenseSchema);