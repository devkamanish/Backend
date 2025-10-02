const express = require("express");
const rateLimit = require("express-rate-limit");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, 
  message: { error: "Too many requests, please try again later." }
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
