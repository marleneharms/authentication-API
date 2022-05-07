const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");
const Anime = require("../model/Anime");

router.get("/animelist", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      res.status(400).json({ msg: "User not found" });
    }

    res.json(user.animeList).status(200);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.post("/animelist", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      res.status(400).json({ msg: "User not found" });
    }

    const tmpAnime = new Anime({
      title: req.body.title,
      genre: req.body.genre,
      imgURL: req.body.imgURL,
      watched: req.body.watched,
    });

    user.animeList.push(tmpAnime);
    await user.save();

    res.json(tmpAnime).status(200);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.put("/animelist/", verify, async (req, res) => {
  const animeID = req.header("anime-id");

  try {
    // Change the watched status of the anime inside the user's anime list
    await User.updateOne(
      { _id: req.user._id, "animeList._id": animeID },
      { $set: { "animeList.$.watched": req.body.watched } }
    );
    res.json({msg:"Anime watched status changed"}).status(200);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/animelist", verify, async (req, res) => {
  const animeID = req.header("anime-id");

  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { animeList: { _id: animeID } } }
    );
    return res.status(200).json({ msg: "Anime removed" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
