
const express = require("express");
const router = require("./routes/main.routes");
const connectToDb = require("./config/mongoDb.config");

const app = express();

app.use(express.json())

connectToDb()
app.use("/", router);


app.use((req, res)=>{
    res.status(404).json({msg :"The requested route is not present"});
})

app.listen(2000, ()=>{
    console.log("Server listening on port http://localhost:2000" )
})

