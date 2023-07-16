const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["Şikayet", "Öneri"],
    required: true,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;

