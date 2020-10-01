const PollModel = require("../models/polls");
const timecheck = require("../utils/timecheck");

class PollService {
  static getAllPolls = async () => {
    try {
      const polls = await PollModel.find();
      return polls;
    } catch (error) {
      throw {
        status: error.status || 500,
        message: `GET \`/polls/\` route failed with the error ${
          error.message || `Unknown Error Occurred`
        }`,
      };
    }
  };

  static getPollById = async (id) => {
    try {
      const poll = await PollModel.findById(id);
      if (poll) {
        if (timecheck(poll.expiry_time)) return poll;
        else await this.deletePollById(poll._id);
      }

      throw {
        status: 404,
        message: `\`404: No polls found with the given ID\``,
      };
    } catch (error) {
      throw {
        status: error.status || 500,
        message: `GET \`/polls/:id\` route failed with the error ${
          error.message || `Unknown Error Occurred`
        }`,
      };
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
      throw {
        status: error.status || 500,
        message: `POST \`/polls/create\` route failed with the error ${
          error.message || `Unknown Error Occurred`
        }`,
      };
    }
  };

  static deletePollById = async (id) => {
    try {
      const deleted = await PollModel.findByIdAndDelete(id);
      if (deleted) return deleted;
      throw {
        status: 404,
        message: `\`404: No polls found with the given ID\``,
      };
    } catch (error) {
      throw {
        status: error.status || 500,
        message: `DELETE \`/polls/:id\` route failed with the error ${
          error.message || `Unknown Error Occurred`
        }`,
      };
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
