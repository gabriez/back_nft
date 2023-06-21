const router = require("express").Router();
const usersRoutes = require("./userRoutes");
const nftRoutes = require("./nftRoutes");
const authRoutes = require("./authRoutes");
const checkoutRoutes = require("./checkoutRoutes");

router.use("/users", usersRoutes);
router.use("/nft", nftRoutes);
router.use("/auth", authRoutes);
router.use("/checkout", checkoutRoutes);

module.exports = router;
