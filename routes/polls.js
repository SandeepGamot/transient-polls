const routes = require("express").Router();
const Poll = require("../models/polls");

routes.get("/", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
routes.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (poll) res.status(200).json(poll);
    else res.status(404).json({ message: "No polls with the given ID" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
routes.post("/", async (req, res) => {
  const poll = new Poll({
    question: req.body.question,
    choices: req.body.choices.map((choice, i) => {
      return { ...choice, text: choice.text, index: i };
    }),
  });
  try {
    const posted = await poll.save();
    res.status(201).json(posted);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

routes.delete("/:id", async (req, res) => {
  try {
    const deleted = await Poll.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(200).json(deleted);
    } else {
      res.status(404).json({ message: "No polls with given ID" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = routes;
