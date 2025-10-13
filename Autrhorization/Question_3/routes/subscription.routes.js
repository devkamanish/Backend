import express from "express";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", authMiddleware("user"), async (req, res) => {
  const { plan } = req.body;
  const userId = req.user.userId;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);

  await Subscription.create({ userId, plan, startDate: new Date(), expiryDate: expiry });
  await User.findByIdAndUpdate(userId, { "subscription.plan": plan, "subscription.expiry": expiry });

  res.json({ message: `Subscribed to ${plan}` });
});

router.get("/subscription-status", authMiddleware("user"), async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user.subscription.expiry && new Date() > user.subscription.expiry) {
    user.subscription.plan = "free";
    await user.save();
  }
  res.json({ plan: user.subscription.plan, expiry: user.subscription.expiry });
});

router.patch("/renew", authMiddleware("user"), async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user.subscription.expiry) return res.json({ message: "No active plan" });

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  user.subscription.expiry = expiry;
  await user.save();

  res.json({ message: "Subscription renewed", expiry });
});

router.post("/cancel-subscription", authMiddleware("user"), async (req, res) => {
  await User.findByIdAndUpdate(req.user.userId, {
    "subscription.plan": "free",
    "subscription.expiry": null
  });
  res.json({ message: "Subscription cancelled" });
});

export default router;
