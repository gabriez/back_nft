module.exports = (sequelize, DataTypes) => {
  return sequelize.define("favorite", {
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
