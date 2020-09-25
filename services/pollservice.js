const { response } = require("express");
const e = require("express");
const PollModel = require("../models/polls");
const timecheck = require("../utils/timecheck");

class PollService {
  static getAllPolls = async () => {
    try {
      const polls = await PollModel.find();
      return polls;
    } catch (error) {
      throw new Error(`GET \`/polls\` route failed with the error of ${error}`);
    }
  };

  static getPollById = async (id) => {
    try {
      const poll = await PollModel.findById(id);
      if (poll) {
        if (timecheck(poll.expiry_time)) return poll;
        else {
          await this.deletePollById(poll._id);
          return { message: "The poll you were looking for has expired" };
        }
      }
      let err = new Error();
      err.status = 404;
      err.message = `\`404: No polls found with the given ID\``;
      throw err;
    } catch (error) {
      throw new Error(
        `GET \`/polls/:id\` route failed with the error ${error}`
      );
    }
  };

  static createNewPoll = async (body) => {
    const created = new PollModel({
      is_public: body.is_public,
      question: body.question,
      choices: body.choices.map((choice, i) => ({
        text: choice,
      })),
      expiry_time: Date.now() + body.hour * 60 * 60 * 1000,
    });

    try {
      const posted = await created.save();
      return posted;
    } catch (error) {
      let err = new Error();
      err.message = `POST \`/polls/create\` route failed with the error ${error}`;
      throw err;
    }
  };

  static deletePollById = async (id) => {
    try {
      const deleted = await PollModel.findByIdAndDelete(id);
      if (deleted) return deleted;
      let err = new Error();
      err.status = 404;
      err.message = `\`404: No polls found with the given ID\``;
      throw err;
    } catch (error) {
      throw new Error(
        `DELETE \`/polls/:id\` route failed with the error ${error}`
      );
    }
  };

  /* Helpful links to what has been done here :
   
  https://stackoverflow.com/a/40381021/10439527
  https://docs.mongodb.com/manual/reference/operator/update/inc/
  Also, weird bug when you pass a callback fn (err, res) as the last arg to findOneAndUpdate() and await it simultaneously. 
  Js Noob mistake, callback and await both make the call run twice choose await over callback.
  More info : https://github.com/Automattic/mongoose/issues/6271#issuecomment-378644852
     */

  static submitVote = async (id, index) => {
    var query = {
      _id: id,
      "choices._id": index,
    };

    var increment = {
      $inc: { "choices.$.votes": 1, total_votes: 1 },
    };

    return PollModel.findOneAndUpdate(query, increment, { new: true });
  };
}

module.exports = PollService;
