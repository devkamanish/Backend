import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blacklist from "../models/blacklist.model.js";

dotenv.config();

export const authMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Token missing" });

      // check blacklist
      const blacklisted = await Blacklist.findOne({ token });
      if (blacklisted) return res.status(403).json({ message: "Token blacklisted" });

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (role && decoded.role !== role)
        return res.status(403).json({ message: "Unauthorized role" });

      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
