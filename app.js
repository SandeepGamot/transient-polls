require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("db conn ok"))
  .on("error", (err) => console.log("error"));

const app = express();

app.use(express.json());
app.use("/polls", require("./routes/polls"));

app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"), () => {
  if (process.env.NODE_ENV === "dev")
    console.log(`http://localhost:${app.get("port")}`);
  else console.log(`prod running on ${app.get("port")} `);
});
