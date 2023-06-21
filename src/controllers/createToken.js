const jwt = require("jsonwebtoken");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const pathToKey = path.join(__dirname, "id_rsa_priv.pem");
const PIV_KEY = fs.readFileSync(pathToKey, "utf8");

const createToken = (user) => {
  try {
    const payload = {
      id: user.id,
      createdAt: moment().unix(),
      expiredAt: moment().add(1, "day").unix(),
    };
    const signedToken = jwt.sign(payload, PIV_KEY, {
      expiresIn: payload.expiredAt,
      algorithm: "RS256",
    });
    return {
      token: "Bearer " + signedToken,
      expires: payload.expiredAt,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createToken };
