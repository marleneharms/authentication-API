const router = require("express").Router();

router.get("/", (req, res) => {
  res
    .json({
      posts: {
        title: "my first post",
        description: "random data you shouldnt access",
      },
    })
    .status(201);
});

module.exports = router;
