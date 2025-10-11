const express = require("express");
const bcrypt = require("bcrypt");
const Usermodel = require("../models/user.model");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
var jwt = require("jsonwebtoken");

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).json({ msg: "Something went wrong" });
      } else {
        await Usermodel.create({ name, email, password: hash });
        res.status(201).json({ msg: "Signup successfull" });
      }
    });
  } catch {
    res.status(500).json({ msg: "Something went wrong" });
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
          var token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY
          );
          res.status(200).json({msg: "Login successfully", token});
        }
      });
    }
  } catch {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = UserRouter;
