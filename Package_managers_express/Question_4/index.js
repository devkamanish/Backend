const express = require("express");
const fileInfo = require("./getFileInfo");
const urlParser = require("./parseUrl");

const app = express();
const PORT = 3000;

app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

app.get("/fileinfo", (req, res) => {
  const { filepath } = req.query;

  if (!filepath) {
    return res.status(400).json({ error: "Missing 'filepath' query parameter" });
  }

  try {
    const details = fileInfo(filepath);
    res.json(details);
  } catch (error) {
    res.status(400).json({ error: "Invalid file path" });
  }
});

app.get("/parseurl", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const details = urlParser(url);
    res.json(details);
  } catch (error) {
    res.status(400).json({ error: "Invalid URL format" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
