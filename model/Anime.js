const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String
  },
  imgURL: {
    type: String,
  },
  watched: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Anime", animeSchema);