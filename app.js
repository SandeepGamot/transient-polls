const express = require("express");
const app = express();
const config = require("./config");
const mongoose = require("mongoose");
const setupDatabase = require("./setup/database");
const setupMiddlewares = require("./setup/middleware");

app.use(express.json());
setupMiddlewares(app);

app.get("/", (req, res) => {
  res
    .status(200)
    .send('<h4>Status: OK!</h4> <h2><a href="/polls">/polls</a></h2>');
});
app.use("/polls", require("./routes/polls"));

app.all("*", (req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: `Error 404:${req.hostname + req.url} not found`,
  });
  next();
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Unknown Error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
  next();
});

setupDatabase(mongoose, config)
  .then((message) => {
    console.log(message);
    app.listen(config.port, () => {
      config.node_env === "dev"
        ? console.log(`http://localhost:${config.port}`)
        : console.log(`prod running on ${config.port}`);
    });
  })
  .catch((message) => {
    console.log(message);
  });
