const jwt = require("jsonwebtoken");
require("dotenv").config();

// combined auth + role check middleware
const authMiddleware = (role) => {
  return (req, res, next) => {
    try {
      // check if authorization header exists
      const token = req.headers?.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Access token missing" });
      }

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
     console.log(decoded)
      // attach user info to request
      req.user = { id: decoded.id, role: decoded.role };
      
      // if a specific role is required
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden: insufficient rights" });
      }
     
      next();
    } catch (err) {
      console.error("Auth error:", err.message);
      return res.status(403).json({ message: "Authentication failed" });
    }
  };
};

module.exports = authMiddleware;
