

const mongoose = require("mongoose")

const connecToMongoDb = ()=>{
    try{
        mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to Db")
    }catch(err){
        console.log(err.message)
    }
}


module.exports= connecToMongoDb;
