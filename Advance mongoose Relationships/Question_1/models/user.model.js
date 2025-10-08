
const mongoose = require("mongoose")


const UserSchema  = new mongoose.Schema({
    name : {type :String, required: true, minlength : 3},
    email : {type :String, required: true,unique: true }
})


const UserModel = mongoose.model("Users", UserSchema)

module.exports = UserModel;

