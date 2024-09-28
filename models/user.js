const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
