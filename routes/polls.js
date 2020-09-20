const routes = require("express").Router();
const Poll = require("../models/polls");
/*
    GET "/polls/:id" should display the poll and let the client vote // check if it's still live
    POST "/polls/" post a new poll and generate a link to share with others    
    DELETE "/polls/:id" delete poll if present
    later: GET "/polls/" shows public polls
 */

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
    else res.status(404).json({ message: "No polls found with the given ID" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

routes.post("/", async (req, res) => {
  const poll = new Poll({
    question: req.body.question,
    choices: req.body.choices,
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
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = routes;
