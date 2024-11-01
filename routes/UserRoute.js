const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/Auth");
const Upload = require("../middlewares/Upload")
const router = express.Router();

const JWT_SECRET = "Mysecret";
//signup route
router.post(
  "/signup",
  [
    body("username")
      .isString()
      .isLength({ max: 15 })
      .withMessage("Username is required, max 15 letters"),
    body("email").isEmail().withMessage("email is requried"),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("password must be atleast 8 characters long"),
  ],
  async (req, res) => {
    //express validator logic
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error });
    }
    //end point main logic
    try {
      const { username, email, password } = req.body;
      const userExist = await User.findOne({ email });

      if (userExist) {
        return res.status(400).json({ message: "email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: "Account Created, Please Log in." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//user login endpoint
router.post(
  "/login",
  [body("email").exists(), body("password").exists()],
  async (req, res) => {
    //express validator logic
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error });
    }
    //end point main logic
    try {
      const { email, password } = req.body;

      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res.status(400).json({ message: "invalid email or password" });
      }

      const correctPass = await bcrypt.compare(password, userExist.password);
      if (!correctPass) {
        return res.status(400).json({ message: "invalid email or password" });
      }

      const token = await jwt.sign({ id: userExist._id }, JWT_SECRET);

      res.status(200).json({ token: token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//profile picture endpoint
router.put("/profile", authMiddleware, Upload.single('pfp'), async (req, res) => {

  try {
    if(!req.file){
      return res.status(404).json({ error: "File not found"});
    }
    const updatedUser = await User.findByIdAndUpdate(req.userId,{profilePicture: req.file.path},{ new: true })
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//user details endpoint
router.get("/", authMiddleware, async (req, res)=>{
  try {
    const user = await User.findOne({ _id: req.userId })
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
