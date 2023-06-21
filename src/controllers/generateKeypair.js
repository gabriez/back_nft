const crypto = require("crypto");
const fs = require("fs");
// const path = require("path");
// const pathToKey = path.join(__dirname, "id_rsa_priv.pem");
// const PIV_KEY = fs.readFileSync(pathToKey, "utf8");

function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  fs.writeFileSync(
    __dirname + "/id_rsa_pub.pem",
    keyPair.publicKey.toString("hex")
  );
  fs.writeFileSync(
    __dirname + "/id_rsa_priv.pem",
    keyPair.privateKey.toString("hex")
  );
}

genKeyPair();
