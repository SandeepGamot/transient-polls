const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [
      true,
      `Make sure that "question" is spelled properly and is given a non empty string.`,
    ],
  },

  choices: {
    type: [
      {
        text: {
          type: String,
          required: [
            true,
            `Make sure that \`text\` is spelled properly and is given a non empty string.`,
          ],
        },
        votes: { type: Number, default: 0 },
        index: Number,
      },
    ],

    validate: {
      validator: (array) => array.length >= 2,
      message: (error) => `Error: There must atleast be 2 choices.`,
    },
  },
});

module.exports = mongoose.model("polls", PollSchema);
