
const express = require("express")
    const nodemailer = require("nodemailer");
  require("dotenv").config()
const app = express()


app.get("/", (req, res)=>{
    res.send("This is working good")
})

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

app.get("/sendemail", async (req, res) => {
  const info = await transporter.sendMail({
    from: '"manish devka ji" <manishdevka76@gmail.com>',
    to: "devkamanish61@gmail.com",
    subject: "Hello ✔ this is the test email",
    text: "Hello world?",
    html: "<b>Hello world this is the test email</b>", // HTML body
  });

  res.status(201).json({ msg: "email sent" });
});



app.listen(3000, ()=>{
    console.log("Server listening on http://localhost:3000")
})