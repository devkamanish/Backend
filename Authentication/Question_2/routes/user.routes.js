const express = require("express");
const bcrypt = require("bcrypt");
const Usermodel = require("../models/user.model");
const saltRounds = 10;
const someOtherPlaintextPassword = "not_bacon";
var jwt = require("jsonwebtoken");

const UserRouter = express.Router();

UserRouter.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  try {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).json("Somthing went wrong");
      } else {
        await Usermodel.create({ name, email, password: hash });
        res.status(201).json("User signed up successfully");
      }
    });
  } catch {
    res.status(500).json("Somthing went wrong");
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Usermodel.findOne({ email });
    if (!user) {
      res.status(404).json({ msg: "User not found" });
    } else {
      let hash = user.password;
      bcrypt.compare(password, hash, function (err, result) {
        if (result == true) {
          // payload is the data you want to store in the token.
          var token = jwt.sign({ userId: user._id },  process.env.JWT_SECRET_KEY
          );
          res.status(200).json({ msg: "User logged in", token });
        } else {
          res.status(401).json({ msg: "Wrong password" });
        }
      });
    }
  } catch (err) {
    res.status(500).json("Somthing went wrong");
  }
});

module.exports = UserRouter;
