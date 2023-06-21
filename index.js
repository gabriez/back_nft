require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const routes = require("./src/routes/index");
const cors = require("cors");
require("./src/db");
const passport = require("passport");
const { isDbLoaded } = require("./src/controllers/dataBase");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [`${process.env.CLIENT_URL}`, "http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "X-Access-Token",
    ],
  })
);
// app.use(
//   session({
//     key: "user_cookie",
//     secret: process.env.SESSION_SECRET,
//     store: new SequelizeStore({
//       db: sequelize,
//     }),
//     resave: false,
//     saveUninitialized: false,
//     proxy: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, //Expire in 1 day
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//     },
//   })
// );

require("./src/config/passport")(passport);
app.use(passport.initialize());
// app.use(passport.session());

isDbLoaded();

app.use("/", routes);
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("*", (req, res, next) => {
  res.status(404).send("<h1>Page not found</h1>");
  next();
});

// Error catching endware
app.use((req, err, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
  console.log(req.session);
  console.log(req.user);
  next();
});

const PORT = 9000;

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running on " + PORT);
});
