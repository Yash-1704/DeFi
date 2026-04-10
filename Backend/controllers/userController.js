const User = require("../models/usermodel");

// Create user
exports.createUser = async (req, res) => {
  try {
    const { walletAddress, username } = req.body;

    let user = await User.findOne({ walletAddress });

    if (user) {
      return res.json(user);
    }

    user = await User.create({ walletAddress, username });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      walletAddress: req.params.address,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};