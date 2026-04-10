const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  type: {
    type: String, // deposit | withdraw | stake | transfer
  },
  amount: {
    type: String,
  },
  to: {
    type: String, // for transfers
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);