const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  is_public: { type: Boolean, default: false },
  total_votes: { type: Number, default: 0 },
  question: {
    type: String,
    required: [
      true,
      `Validation failed for \"question\". Make sure it is spelled correctly and provided with non-empty string`,
    ],
  },
  choices: {
    type: [
      {
        text: {
          type: String,
          required: [
            true,
            `Validation failed for \"text\". Make sure it is spelled correctly and provided with non-empty string`,
          ],
        },
        votes: { type: Number, default: 0 },
      },
    ],
    validate: {
      validator: (array) => array.length >= 2,
      message: `Validation for min length for \"choices\". Make sure choices array atleast have 2 choices`,
    },
  },
  expiry_time: Number,
});

PollSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("polls", PollSchema);
