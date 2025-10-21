
const { default: mongoose } = require("mongoose")


const connect =  async()=>{
    try {
      await mongoose.connect(MONGO_URL);
      console.log("connect to db"); 
    } catch (error) {
    console.log("Error while connecting to db");
    console.log(error.message) 
    }
}

module.exports= connect;

