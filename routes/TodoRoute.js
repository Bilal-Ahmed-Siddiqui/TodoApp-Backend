const express = require("express");
const Todo = require("../models/Todo");
const { body, validationResult } = require("express-validator");
const router = express.Router();

//post request
router.post(
  "/create",
  [
    body("title")
      .isString()
      .isLength({ max: 50 })
      .withMessage("Title is required"),
    body("description")
      .optional()
      .isString()
      .isLength({ max: 200 })
      .withMessage(
        "Description must be a string and cannot exceed 500 characters"
      ),
  ],
  async (req, res) => {
    //express validation check
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error });
    }

    //end point main logic
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
  }
);

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
router.put(
  "/update/:id",
  [
    body("title")
      .optional()
      .isString()
      .isLength({ min: 50 })
      .withMessage("Title must be a non-empty string"),
    body("description")
      .optional()
      .isString()
      .isLength({ max: 200 })
      .withMessage(
        "Description must be a string and cannot exceed 500 characters"
      ),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean"),
  ],
  async (req, res) => {
    //express validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //end point main logic
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
  }
);

//delete request
router.delete(
  "/delete/:id",
  async (req, res) => {
    //end point main logic
    try {
      const { id } = req.params;

      const deletedTodo = await Todo.findByIdAndDelete(id);

      if (!deletedTodo) {
        res.status(404).json({ error: "todo Not Found" });
      } else {
        res.status(201).json({ Success: "Todo deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
