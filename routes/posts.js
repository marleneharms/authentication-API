const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");

const publicAnimeList = [
  {
    id: 1,
    title: "Naruto",
    watched: false,
  },
  {
    id: 2,
    title: "Attack on Titan",
    watched: false,
  },
  {
    id: 3,
    title: "The Promised Neverland",
    watched: false,
  },
  {
    id: 4,
    title: "Fullmetal Alchemist",
    watched: false,
  },
  {
    id: 5,
    title: "One Piece",
    watched: false,
  },
  {
    id: 6,
    title: "One Punch",
  },
];

const privateAnimeList = [
  {
    id: 1,
    title: "Death Note",
    watched: false,
  },
];

router.get("/private", verify, (req, res) => {
  res.json(privateAnimeList);
});

router.get("/public", (req, res) => {
  res.json(publicAnimeList);
});

module.exports = router;
