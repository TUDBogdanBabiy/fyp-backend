const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");
const User = require("../models/User");
const { registerValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/staff", verifyToken, async (req, res) => {
  try {
    const staff = await User.find({ type: "staff" });
    res.json(staff);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/customers", verifyToken, async (req, res) => {
  try {
    const customers = await User.find({ type: "customers" });
    res.json(customers);
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/delete/:user_id", verifyToken, async (req, res) => {
  const id = req.params.user_id;
  try {
    const user = await User.findByIdAndDelete(id, { useFindAndModify: false });
    if (user) {
      res.status(200).send("User Deleted Successfully!");
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.patch("/update/:user_id", verifyToken, async (req, res) => {
  const id = req.params.user_id;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (user) {
      res.status(200).send("User Updated Successfully!");
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  // Validate the data before creating a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("This email already exists!");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email,
    password: hashedPassword,
    type: req.body.type,
  });
  try {
    const savedUser = await user.save();
    res.status(200).send("User Added Successfully!");
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
