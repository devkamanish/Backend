
const express = require("express");
const connecToMongoDb = require("./config/mongoose.connect");
const router = require("./routes/main.routes");

const app = express();
app.use(express.json())
connecToMongoDb();

app.use("/", router);


app.use((req, res)=>{
   return res.status(404).json({msg: "The requested route is not present"})
})
app.listen(300, ()=>{
    console.log("Server listening on port http://localhost:300")
})




