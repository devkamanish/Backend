const express = require("express");
const app = express();

app.get("/home", (req, res) => {
  res.json({ message: "This is a home page" });
});

app.get("/contactus", (req, res) => {
  res.json({ message: "Contact us at contact@contact.com" });
});

app.get("/about", (req, res) => {
  res.json({ message: "Welcome to the About page!" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
