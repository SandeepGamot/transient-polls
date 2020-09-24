const routes = require("express").Router();
const PollService = require("../services/pollservice");

routes.get("/", async (req, res) => {
  try {
    const polls = await PollService.getAllPolls();
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

routes.get("/:id", async (req, res) => {
  try {
    const poll = await PollService.getPollById(req.params.id);
    res.status(200).json(poll);
  } catch (error) {
    res
      .status(error.status || 500)
      .json(error.message || "Unknown Error Occurred");
  }
});

routes.post("/create", async (req, res) => {
  try {
    const posted = await PollService.createNewPoll(req.body);
    res.status(200).json(posted);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

routes.delete("/:id", async (req, res) => {
  try {
    const deleted = await PollService.deletePollById(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

routes.patch("/:id/:index", async (req, res) => {
  try {
    const patched = await PollService.submitVote(
      req.params.id,
      req.params.index
    );
    res.json(patched);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = routes;
