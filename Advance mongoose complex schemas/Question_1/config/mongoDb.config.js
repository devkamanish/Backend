
const mongoose = require("mongoose")

const connectDb = async ()=>{
    try{
      await mongoose.connect("mongodb://127.0.0.1:27017/Question1");
      console.log("Connected to Db")
    }catch(err){
      console.log(err.message)
    }
}


module.exports = connectDb;