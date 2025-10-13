var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRES || "7d";

function signAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiry });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiry });
}
function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}


module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
