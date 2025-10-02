
const express = require("express");
const limiter = require("../../../practise/middlewares/rateLimiter");

const router = express.Router()

  router.get("/public", (req, res) => {
    res.json({ message: "This is a public endpoint!" });
  });

 router.get("/limited", limiter, (req, res) => {
    res.json({ message: "You have access to this limited endpoint!" });
  });


  module.exports = router;

