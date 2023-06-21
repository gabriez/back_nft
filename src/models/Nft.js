module.exports = (sequelize, DataTypes) => {
  return sequelize.define("nft", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactAddress: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    ethPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usdPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wallet: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "sold"),
      defaultValue: "available",
    },
  });
};
