const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: String,
  choices: [{ text: String, votes: { type: Number, default: 0 } }],
});

module.exports = mongoose.model("Poll", PollSchema);
