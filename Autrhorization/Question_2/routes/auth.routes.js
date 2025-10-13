const express = require("express");
const Usermodel = require("../models/user.model");
const AuthRouter = express.Router();

const bcrypt = require("bcrypt");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

AuthRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email and password are required" });
    }
    const existing = await Usermodel.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "Email already in use" });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ msg: "Something went wrong" });
      } else {
        await Usermodel.create({
          username,
          email,
          password: hash,
          role: role === "admin" ? "admin" : "user",
        });
        return res.status(201).json({ message: "User created" });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

AuthRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });
    const user = await Usermodel.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    let hash = user.password;
    bcrypt.compare(password, hash).then(async function (result) {
      if (result === true) {
        const payload = { id: user._id.toString(), role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        user.refreshTokens.push(refreshToken);
        if (user.refreshTokens.length > 10)
          user.refreshTokens = user.refreshTokens.slice(-10);
        await user.save();
        return res
          .status(200)
          .json({ msg: "Login success", accessToken, refreshToken });
      } else {
        res.status(401).json({ msg: "Wrong password" });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

AuthRouter.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ msg: "Refresh token required" });
    
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }
    const user = await Usermodel.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // ensure refresh token exists in DB for this user
    if (!user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ msg: "Refresh token not recognized" });
    }
    
    // issue new access token
    const newAccessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role,
    });  
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

AuthRouter.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken required" });
    await Usermodel.updateOne(
      { refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } } );
    return res.json({ msg: "User logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = AuthRouter;
