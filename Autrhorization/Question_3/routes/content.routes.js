import express from "express";
import Content from "../models/content.model.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/free", async (req, res) => {
  const content = await Content.find({ type: "free" });
  res.json(content);
});

router.get("/premium", authMiddleware("user"), async (req, res) => {
  const user = req.user;
  if (!["premium", "pro", "admin"].includes(user.role))
    return res.status(403).json({ message: "Upgrade plan to view premium content" });
  const content = await Content.find({ type: "premium" });
  res.json(content);
});

router.post("/", authMiddleware("admin"), async (req, res) => {
  const { title, description, type } = req.body;
  await Content.create({ title, description, type });
  res.json({ message: "Content added" });
});

router.delete("/:id", authMiddleware("admin"), async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: "Content deleted" });
});

export default router;

