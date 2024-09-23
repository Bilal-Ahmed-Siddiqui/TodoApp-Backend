const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();

//post request
router.post("/create", async (req, res) => {
  try {
    const { title, description } = req.body;

    
    const newTodo = new Todo({
      title,
      description,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get request
router.get("/", (req, res) => {
  res.send("todo route working");
});

module.exports = router;
