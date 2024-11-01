const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoRoute = require("./routes/TodoRoute");
const UserRoute = require("./routes/UserRoute");
require("dotenv").config();

const app = express();

const AtlasURL = `mongodb+srv://bilalahmed:${process.env.DB_PASSWORD}@forteaching.plyfh.mongodb.net/?retryWrites=true&w=majority&appName=forTeaching`;

app.use(express.json());
app.use(cors());

mongoose
  .connect(AtlasURL)
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.error("some error", err);
  });

app.get("/", (req, res) => {
  res.send("Working");
});

// Routes
app.use("/todo", TodoRoute);
app.use("/user", UserRoute);

// Export the app for Vercel
module.exports = app;
