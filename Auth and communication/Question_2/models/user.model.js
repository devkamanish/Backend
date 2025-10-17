
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name : String,
  email : {type : String , unique: true}, 
  password: String
})

const Usermodel = mongoose.model("Users", UserSchema)
module.exports = Usermodel;

