const express = require("express");
const eventLogger = require("./eventLogger");
const delay = require("./delay");

const app = express();
const PORT = 3000;

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

// ✅ Emit route
app.get("/emit", (req, res) => {
  const { message } = req.query;

  if (!message) {
    return res.status(400).json({ error: "Message query param is required" });
  }

  // trigger event
  eventLogger.emit("log", message);

  res.json({
    status: "Event logged",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Delay route
app.get("/delay", async (req, res) => {
  const { message, time } = req.query;

  if (!message || !time) {
    return res.status(400).json({ error: "Message and time query params are required" });
  }

  try {
    const result = await delay(message, parseInt(time));
    res.json({
      message: result,
      delay: `${time}ms`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
