
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String // Store hashed password
});

const Usermodel = mongoose.model("Users", userSchema);


module.exports = Usermodel;


