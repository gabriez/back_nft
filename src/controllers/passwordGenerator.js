const crypto = require("crypto");
const LOWERCASE_ALPHABET = "abcdefghijklmnopqrstuvwxyz"; // 26 chars
const UPPERCASE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 26 chars
const NUMBERS = "0123456789"; // 10 chars
const SYMBOLS = ",./<>?;'\":[]\\|}{=-_+`~!@#$%^&*()"; // 32 chars
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars

const generateRandomPassword = (length) => {
  var rb = crypto.randomBytes(length);
  var rp = "";

  for (var i = 0; i < length; i++) {
    rb[i] = rb[i] % ALPHANUMERIC_CHARS.length;
    rp += ALPHANUMERIC_CHARS[rb[i]];
  }

  return rp;
};

module.exports = { generateRandomPassword };
