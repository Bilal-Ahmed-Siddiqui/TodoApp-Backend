const express = require("express");
const mongoose = require("mongoose");
const TodoRoute = require("./routes/TodoRoute");
const UserRoute = require("./routes/UserRoute");
require("dotenv").config();
const app = express();

localURL = "mongodb://localhost:27017/Backend";
AtlasURL = `mongodb+srv://bilalahmed:${process.env.DB_PASSWORD}@forteaching.plyfh.mongodb.net/?retryWrites=true&w=majority&appName=forTeaching`;

app.use(express.json());

mongoose
  .connect(AtlasURL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.error("some error", err);
  });

app.get("/", (req, res) => {
  // console.log("someone sent a request")
  res.send("Working");
});

//routes

app.use("/todo", TodoRoute);
app.use("/user", UserRoute);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
