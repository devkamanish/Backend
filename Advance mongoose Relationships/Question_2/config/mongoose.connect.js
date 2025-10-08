
 const mongoose = require("mongoose")


const connecToMongoDb = async ()=>{
    try{
   await mongoose.connect("mongodb://127.0.0.1:27017/Question2")
   console.log("connected to DB")

    }catch(err){
     console.log(err.message)
    }
}

module.exports = connecToMongoDb;


