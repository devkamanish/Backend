import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";
import { generateTokens } from "../utils/tokenUtil.js";

dotenv.config();
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, role });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch {
    res.status(400).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ message: "Wrong password" });

  const tokens = generateTokens(user);
  res.json(tokens);
});

router.post("/logout", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token missing" });
  await Blacklist.create({ token });
  res.json({ message: "Logged out successfully" });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Missing refresh token" });

  const blacklisted = await Blacklist.findOne({ token: refreshToken });
  if (blacklisted) return res.status(403).json({ message: "Token blacklisted" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    const tokens = generateTokens(user);
    res.json(tokens);
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

export default router;
