const router = require("express").Router();
const passport = require("passport");
const { isAuthenticated } = require("../controllers/isAuthenticated");
const { createToken } = require("../controllers/createToken");
const { User } = require("../db");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
);

router.delete("/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.json({ message: "Logged out" });
  } else {
    res.end();
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res) => {
  passport.authenticate("google", async (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const token = createToken(user);
      const response = {
        success: true,
        token: token.token,
        expiresIn: token.expires,
        user: user,
      };
      res.json(response);
      // res.redirect("http://localhost:3000/dashboard");

      // res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
  })(req, res);
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user", "read:email"] })
);

router.get("/github/callback", (req, res) => {
  passport.authenticate("github", async (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const token = createToken(user);
      res.json({
        success: true,
        token: token.token,
        expiresIn: token.expires,
      });
    }
  })(req, res);
});

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get("/facebook/callback", (req, res) => {
  passport.authenticate("facebook", async (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const token = createToken(user);
      res.json({
        success: true,
        token: token.token,
        expiresIn: token.expires,
      });
    }
  })(req, res);
});

module.exports = router;
