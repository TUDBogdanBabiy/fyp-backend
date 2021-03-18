const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const verifyToken = require("./verifyToken");

router.post("/register", async (req, res) => {
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
    type: "customer",
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });
    res.json({ username: user.firstname, user_type: user.type, token: token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  // Validate the data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("Incorrect email or password!");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect email or password!");

  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res.json({ username: user.firstname, user_type: user.type, token: token });
});

router.post("/login/google", async (req, res) => {
  const google_id_token = req.header("id_token");

  try {
    const { data } = await axios.get(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + google_id_token
    );
    const { aud, email, given_name, family_name } = data;
    if (aud !== process.env.GOOGLE_CLIENT_ID)
      throw new Error("Failed to login");
    const user = await User.findOne({ email: email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });
      return res.json({
        username: user.firstname,
        user_type: user.type,
        token: token,
      });
    } else {
      const user = new User({
        firstname: given_name,
        surname: family_name,
        email: email,
        type: "customer",
      });

      const savedUser = await user.save();

      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });
      return res.json({
        username: user.firstname,
        user_type: user.type,
        token: token,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/user", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const user = await User.findOne({ _id: user_id });
  const newToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res.json({
    username: user.firstname,
    _id: user_id,
    user_type: user.type,
    token: newToken,
  });
});

module.exports = router;
