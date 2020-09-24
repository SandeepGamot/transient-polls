const express = require("express");
const app = express();
const config = require("./config");
const mongoose = require("mongoose");
const setupDatabase = require("./setup/database");
mongoose.set("debug", true);
app.use(express.json());
app.use("/polls", require("./routes/polls"));

app.all("*", (req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: `Error 404:${req.hostname + req.url} not found`,
  });
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Unknown Error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

setupDatabase(mongoose, config)
  .then((message) => {
    console.log(message);
    app.listen(config.port, () => {
      console.log(`http://localhost:${config.port}`);
    });
  })
  .catch((message) => {
    console.log(message);
  });
