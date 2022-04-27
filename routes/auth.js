//const router = require('express').Router();
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //validate data before we create a new user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  // checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ msg: "Email already exists" });

  //Hash  the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await user.save();
    const accessToken = await jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    res.json({ msg: "User created", accessToken });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  // validate the data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  // checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "Email is wrong" });
  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ msg: "Invalid password" });

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res
    .header("auth-token", token)
    .json({ token: token, msg: "Logged in successfully" });
  //res.send('Loged in!');
});

module.exports = router; // usarlo fuera de auth
// module.exports = {
//     myrouter: router,
//     title: 'hola'
// }
// exports.router = router
