const Group = require("../models/groupModel");

// ── Create group ───────────────────────────────────────────────
exports.createGroup = async (req, res) => {
  try {
    const { name, members, creator } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }
    // Creator is automatically the first member
    const initialMembers = creator
      ? [...new Set([creator, ...(members || [])])]
      : members || [];

    const group = new Group({ name: name.trim(), members: initialMembers, creator: creator || "" });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Get all groups (optionally filter by member) ───────────────
exports.getGroups = async (req, res) => {
  try {
    const { member, pendingMember } = req.query;
    let filter = {};
    if (member) {
      filter = { members: { $in: [member.toLowerCase()] } };
    } else if (pendingMember) {
      filter = { pendingMembers: { $in: [pendingMember.toLowerCase()] } };
    }
    const groups = await Group.find(filter).sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Get single group by ID ─────────────────────────────────────
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Add member invite ──────────────────────────────────────────
exports.addMember = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    const addr = walletAddress.toLowerCase();
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const isMember = group.members.map(m => m.toLowerCase()).includes(addr);
    const alreadyPending = group.pendingMembers.map(m => m.toLowerCase()).includes(addr);
    if (isMember) {
      return res.status(400).json({ error: "Member already exists in this group" });
    }
    if (alreadyPending) {
      return res.status(400).json({ error: "Invite already pending for this member" });
    }

    group.pendingMembers.push(addr);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Confirm invited member ────────────────────────────────────
exports.confirmMember = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    const addr = walletAddress.toLowerCase();
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const pendingIndex = group.pendingMembers.map(m => m.toLowerCase()).indexOf(addr);
    if (pendingIndex === -1) {
      return res.status(400).json({ error: "No pending invite found for this member" });
    }

    group.pendingMembers.splice(pendingIndex, 1);
    if (!group.members.map(m => m.toLowerCase()).includes(addr)) {
      group.members.push(addr);
    }
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Decline invited member ────────────────────────────────────
exports.declineMember = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    const addr = walletAddress.toLowerCase();
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.pendingMembers = group.pendingMembers.filter(m => m.toLowerCase() !== addr);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Delete group ─────────────────────────────────────────────
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json({ success: true, message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Fund pool ──────────────────────────────────────────────────
exports.fundPool = async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;
    if (!walletAddress || !amount) {
      return res.status(400).json({ error: "walletAddress and amount are required" });
    }

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    const addr = walletAddress.toLowerCase();
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // Update contribution
    const current = group.contributions.get(addr) || 0;
    group.contributions.set(addr, parseFloat((current + parsed).toFixed(6)));
    group.totalPool = parseFloat(((group.totalPool || 0) + parsed).toFixed(6));

    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
