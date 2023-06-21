const { User } = require("../db");
const bcrypt = require("bcryptjs");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { generateRandomPassword } = require("../controllers/passwordGenerator");
const path = require("path");
const fs = require("fs");
const pathToKey = path.join(__dirname, "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const JWTStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
  await User.findOne({
    where: { id: jwt_payload.id },
    attributes: { exclude: ["password"] },
  })
    .then((user) => {
      if (user) {
        if (jwt_payload.expiresAt < new Date() / 1000) {
          console.log("Token expired");
          return done(null, false);
        } else {
          return done(null, user);
        }
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err, null);
    });
});

module.exports = (passport) => {
  passport.use(JWTStrategy);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const userWithSameEmail = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (userWithSameEmail) {
          userWithSameEmail.googleId = profile.id;
          await userWithSameEmail.save();
          return done(null, userWithSameEmail);
        } else {
          const randomPass = generateRandomPassword(10);
          const pass = bcrypt.hashSync(randomPass, 10);
          const user = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            password: pass,
          };
          User.findOne({ where: { googleId: profile.id } }).then(
            (foundUser) => {
              if (foundUser) {
                done(null, foundUser);
              } else {
                User.create(user)
                  .then((newUser) => {
                    done(null, newUser);
                  })
                  .catch((err) => {
                    done(err);
                  });
              }
            }
          );
        }
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const userWithSameEmail = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (userWithSameEmail) {
          userWithSameEmail.githubId = profile.id;
          await userWithSameEmail.save();
          return done(null, userWithSameEmail);
        } else {
          const randomPass = generateRandomPassword(10);
          const pass = bcrypt.hashSync(randomPass, 10);
          const user = {
            githubId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            password: pass,
          };
          if (user.email === null) {
            user.email = "No email provided";
          }
          User.findOne({ where: { githubId: profile.id } }).then(
            (foundUser) => {
              if (foundUser) {
                done(null, foundUser);
              } else {
                User.create(user)
                  .then((newUser) => {
                    done(null, newUser);
                  })
                  .catch((err) => {
                    done(err);
                  });
              }
            }
          );
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const userWithSameEmail = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (userWithSameEmail) {
          userWithSameEmail.facebookId = profile.id;
          await userWithSameEmail.save();
          return done(null, userWithSameEmail);
        } else {
          const randomPass = generateRandomPassword(10);
          const pass = bcrypt.hashSync(randomPass, 10);
          const user = {
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            password: pass,
          };
          User.findOne({ where: { facebookId: profile.id } }).then(
            (foundUser) => {
              if (foundUser) {
                done(null, foundUser);
              } else {
                User.create(user)
                  .then((newUser) => {
                    done(null, newUser);
                  })
                  .catch((err) => {
                    done(err);
                  });
              }
            }
          );
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    await User.findOne({ where: { id: userId } })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  });
};
