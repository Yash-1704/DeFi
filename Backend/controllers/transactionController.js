const Transaction = require("../models/transactionModel");

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    const tx = await Transaction.create(req.body);
    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user transactions
exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({
      walletAddress: req.params.address,
    }).sort({ timestamp: -1 });

    res.json(txs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};