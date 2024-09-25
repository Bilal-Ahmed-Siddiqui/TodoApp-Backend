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
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get request
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update request
router.put("/update/:id", async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;
    const { id } = req.params;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, isCompleted },
      { new: true }
    );

    if (!updatedTodo) {
      res.status(404).json({ error: "todo Not Found" });
    } else {
      res.status(201).json(updatedTodo);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//delete request
router.delete("/delete/:id", async (req, res)=>{
  try {
    const { id } = req.params;
    
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if(!deletedTodo){
      res.status(404).json({ error: "todo Not Found" });
    }
    else{
      res.status(201).json({Success:"Todo deleted successfully"});
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
