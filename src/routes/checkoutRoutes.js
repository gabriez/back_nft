const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const passport = require("passport");
const router = require("express").Router();
const { User, Nft } = require("../db");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });

    const { id, amount, nftId } = req.body;

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: "Payment for NFT",
      payment_method: id,
      confirm: true,
    });

    if (payment.status === "succeeded") {
      const nft = await Nft.findOne({
        where: { id: nftId },
      });
      (nft.userId = user.id), (nft.status = "sold"), await nft.save();

      res.send({ message: "Successful Payment" });
    }
  }
);

module.exports = router;
