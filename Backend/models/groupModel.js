const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: String, // wallet address of group creator
    default: ''
  },
  members: [
    {
      type: String // wallet addresses
    }
  ],
  pendingMembers: {
    type: [String],
    default: []
  },
  contributions: {
    type: Map,
    of: Number,
    default: {}
  },
  totalPool: {
    type: Number,
    default: 0
  },
  settled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Group", groupSchema);