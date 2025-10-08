
const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    bio : {
        type: String,default : ""
    },
    socialMediaLinks: {type : [String], default: []},
    user: {type:mongoose.Schema.Types.ObjectId , ref : "Users", required: true,unique:true}
})


const ProfileModel = mongoose.model("Profile", profileSchema)


module.exports  = ProfileModel;

