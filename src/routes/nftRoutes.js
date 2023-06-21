const router = require("express").Router();
const { Nft } = require("../db");
const sequelize = require("sequelize");

router.get("/", async (req, res, next) => {
  try {
    const nfts = await Nft.findAll();
    res.json(nfts);
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { nft } = req.query;
    const nfts = await Nft.findAll({
      where: {
        name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("name")),
          "LIKE",
          "%" + nft + "%"
        ),
      },
    });
    res.send(nfts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
