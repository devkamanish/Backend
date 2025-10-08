
const express = require("express")
const connecToMongoDb = require("./configs/mongoDb.config")
const router = require("./routes/main.routes")
 
const app = express()
app.use(express.json())
 connecToMongoDb()
 
app.use("/", router)

app.use((req, res)=>{
    res.status(404).json({msg : "This request is not found"})
    
})
app.listen(500, ()=>{
    console.log("Server listening on port http://localhost:500")
})


