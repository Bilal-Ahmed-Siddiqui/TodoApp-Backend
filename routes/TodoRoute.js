const express = require("express");
const { body, validationResult } = require("express-validator");
const Todo = require("../models/Todo");
const authMiddleware = require("../middlewares/Auth");
const router = express.Router();

//post request
router.post(
  "/create",
  authMiddleware,
  [
    body("title")
      .isString()
      .isLength({ max: 50 })
      .withMessage("Title must be string"),
    body("description")
      .isString()
      .optional()
      .isLength({ max: 200 })
      .withMessage("description must be string, max 10 characters"),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error });
      }
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
      .isLength({ max: 50 })
      .withMessage("title Must be string max 50 letters"),
    body("description")
      .optional()
      .isString()
      .isLength({ max: 200 })
      .withMessage("Description Must be string max 200 letters"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be boolean"),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error });
      }

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
router.delete("/delete/:id", async (req, res) => {
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
});

module.exports = router;
