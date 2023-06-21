const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { createToken } = require("../controllers/createToken");
const passport = require("passport");
const { User, Nft, Favorite } = require("../db");
const bcrypt = require("bcryptjs/dist/bcrypt");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  }
);

router.post(
  "/register",
  [
    check("name").notEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("password").notEmpty().isLength({ min: 8 }),
    check("walletAddress").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const { name, email, password, walletAddress } = req.body;
      const userWithSameEmail = await User.findOne({
        where: { email: email },
      });
      if (userWithSameEmail) {
        res
          .status(400)
          .json({ message: "User with this email already exists" });
      } else {
        const newUser = await User.create({
          name: name,
          email: email,
          password: bcrypt.hashSync(password, 10),
          walletAddress: walletAddress,
        });

        res.json({
          success: true,
          message: "User created successfully",
        });
      }
    }
  }
);

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  await User.findOne({
    where: { email: email },
  })
    .then(async (user) => {
      if (!user) {
        res.status(400).json({ message: "Email or Password incorrect" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Email or Password incorrect" });
      }

      const token = createToken(user);
      res.json({
        success: true,
        token: token.token,
        expiresIn: token.expires,
        user: user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.put(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.body.id;
      const { name, email, walletAddress, password, img } = req.body;
      const updatedUser = await User.findOne({ where: { id: id } });
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
      }
      if (password) {
        updatedUser.password = bcrypt.hashSync(password, 10);
      }
      name && (updatedUser.name = name);
      email && (updatedUser.email = email);
      walletAddress && (updatedUser.walletAddress = walletAddress);
      img && (updatedUser.img = img);

      await updatedUser.save();
      res.json({ message: "User updated" });
    } catch (err) {
      console.log(err);
    }
  }
);

router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { name } = req.body;
      await User.destroy({
        where: { id: userId },
      });
      res.json({ success: `User ${name} deleted` });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/fav",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const fav = await User.findAll({
        where: { id: userId },
        include: [
          {
            model: Nft,
            as: "favorites",
            attributes: { exclude: ["userId"] },
          },
        ],
        attributes: { exclude: ["password"] },
      });
      res.send(fav);
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/fav",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const nftId = req.body.nftId;
      const fav = await Favorite.findOne({
        where: { nftId: nftId, userId: userId },
      });

      if (!fav) {
        await Favorite.create({
          userId: userId,
          nftId: nftId,
        });
        res.json({ message: "Nft added to favorites" });
      } else {
        fav.isFavorite = !fav.isFavorite;
        await fav.save();
        res.json({ message: "Favorites Updated" });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
