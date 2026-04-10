const Group = require("../models/groupModel");

// Create group
exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = new Group({ name, members });
    await group.save();

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all groups
exports.getGroups = async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
};