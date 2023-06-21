const Sequelize = require("sequelize");
const { DATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const UserModel = require("../src/models/User");
const NftModel = require("./models/Nft");
const FavoriteModel = require("./models/Favorite");

// Conexión de Sequelize con la DB
const sequelize = new Sequelize(`${DATABASE}`, `${DB_USER}`, `${DB_PASSWORD}`, {
  host: `${DB_HOST}`,
  dialect: "mysql",
  port: 6760,
  dialectModule: require("mysql2"),
});

const User = UserModel(sequelize, Sequelize);
const Nft = NftModel(sequelize, Sequelize);
const Favorite = FavoriteModel(sequelize, Sequelize);

//Relaciones
User.hasMany(Nft);
Nft.belongsTo(User);

User.belongsToMany(Nft, { as: "favorites", through: Favorite });
Nft.belongsToMany(User, { as: "favorites", through: Favorite });

//Poner el force en true para que se elimine y cree la DB cada vez que se levanta el server
sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  User,
  Nft,
  Favorite,
  sequelize,
};
