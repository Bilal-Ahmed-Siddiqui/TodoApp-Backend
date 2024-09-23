const express = require("express");
const mongoose = require("mongoose");
const TodoRoute = require("./routes/TodoRoute")
const app = express();

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/Backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is connected");
  }).catch((err)=>{console.error("some error", err)})

app.get("/", (req, res) => {
  // console.log("someone sent a request")
  res.send("Working");
});

//routes

app.use("/todo", TodoRoute)

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
