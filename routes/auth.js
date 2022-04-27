//const router = require('express').Router();
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

let refreshTokens = [];

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
        expiresIn: "15m",
      }
    );
    res.json({ msg: "User created", accessToken });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
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
  const accessToken = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  //refresh token
  const refreshToken = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  refreshTokens.push(refreshToken);

  console.log(refreshTokens);


  res.json({ accessToken, refreshToken, msg: "Logged in successfully" });
  //res.send('Logzed in!');
});


// create new access token from refres access token
router.post("/token", async (req, res) => {
  const refreshToken = req.header("auth-token");

  if (!refreshToken) return res.status(401).send("Token is not provided");

  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({ msg: "Refresh token is not valid" });
  }

  try{
     const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
     // user = { _id: user._id, name: user.name, email: user.email };
     const {_id, email, name} = user;
     const accessToken = await jwt.sign(
        { _id, name, email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
});

module.exports = router; // usarlo fuera de auth
// module.exports = {
//     myrouter: router,
//     title: 'hola'
// }
// exports.router = router
