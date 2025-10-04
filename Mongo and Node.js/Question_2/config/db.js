
const mongoose = require("mongoose")


const connectDb = async ()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/Question2");
        console.log("Connected to DB")
    }catch(err){
        console.log("Error while connecting")
        console.log(err.messsage)

    }
}

module.exports = connectDb;


