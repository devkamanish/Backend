const express = require("express");
const Usermodel = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config()
const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ msg: "Email, name and password are required" });
  }
  try {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).json({ msg: "Something went wrong" });
      } else {
        await Usermodel.create({ name, email, password: hash });
        res.status(201).json({ msg: "Signup successfull" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "password and email are required for login" });
  }

  try {
    let user = await Usermodel.findOne({ email });
    if (!user) {
      res.status(404).json({ msg: "User not found please signup" });
    }
    let hash = user.password;

    bcrypt.compare(password, hash, function (err, result) {
      if (result == true) {
        var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ msg: "User login successfull ", token });
      } else {
        res.status(401).json({ msg: "Wrong password" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    // we cannoot use gmail password google has security policy
    // create an app in google account, use that app password
    user: process.env.GOGGLE_APP_EMAIL,
    pass: process.env.GOGGLE_APP_PASSWORD,
  },
});



UserRouter.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  let user = await Usermodel.findOne({ email });
  if (!user) {
    res.status(404).json({ msg: "User not found" });
  } else {
    let resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 150,
    });
    let resetPassLink = `http://localhost:8080/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: '"Admin" <manishdevka76@gmail.com>',
      to: user.email,
      subject: "Password reset link",
      html: `<b>Hello ${user.name} this is the password reset link.</b>
    <h4>${resetPassLink}</h4>`,
    });
    res.status(200).json({
      msg: "Password reset link sent to the registered email, please reset within 2 mins",
    });
  }
});

UserRouter.post("/reset-password", async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      console.log(decoded);
      let user = await Usermodel.findById(decoded.userId);
      bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          res.status(500).json({ msg: "something went wrong" });
        } else {
          user.password = hash;
          await user.save();
          console.log(user);

          res.json({ msg: "Password reset successfully" });
        }
      });
    }
  } catch (err) {
    if (err.message == "jwt expired") {
      res
        .status(403)
        .json({
          msg: "Password reset link expired, please click forget password again",
        });
    } else {
      res
        .status(500)
        .json({ msg: "Something went wrong, please try again later",error: err.message});
    }
  }
});
module.exports = UserRouter;



