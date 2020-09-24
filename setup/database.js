module.exports = (mongoose, config) => {
  mongoose.connect(config.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify : false,
  });

  return new Promise((resolve, reject) => {
    mongoose.connection
      .once("open", () => {
        resolve(`db conn succ`);
      })
      .on(`error`, () => {
        reject(`db conn failed`);
      });
  });
};
