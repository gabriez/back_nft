const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("user", {
    googleId: { type: DataTypes.STRING, allowNull: true },
    githubId: { type: DataTypes.STRING, allowNull: true },
    facebookId: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING(150), allowNull: false },
    walletAddress: { type: DataTypes.STRING, allowNull: true },
    img: {
      type: DataTypes.STRING,
      defaultValue: "https://i.ibb.co/NY16SwT/avatar.png",
    },
  });
};
