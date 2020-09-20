require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .on("error", (err) => console.log(`db conn failed ${err} F in chat plz`))
  .once("open", () => console.log("db conn succ"));

app.use(express.json());
app.use("/polls", require("./routes/polls"));

app.listen(port, () => {
  if (process.env.NODE_ENV === "dev") console.log(`http://localhost:${port}`);
  else console.log(`prod server running on port:${port}`);
});
