const mongoose = require("mongoose");
const Anime = require("../model/Anime");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  animeList: [Anime.schema],
});

module.exports = mongoose.model("User", userSchema);
