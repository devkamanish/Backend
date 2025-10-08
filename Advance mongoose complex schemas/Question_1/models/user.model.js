
const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    street : {type :String},
    city  : {type :String},
    state : {type  : String},
    country: {type : String, default: "India"},
    pincode: {type : Number, required: true}
})

const userSchema = new mongoose.Schema({
    name  : {type :String, required : true},
    email : {type : String, required: true},
    age : {type :Number, required:true},
    address : [addressSchema]
})


const UserModel = mongoose.model("Users", userSchema)


module.exports = UserModel;
