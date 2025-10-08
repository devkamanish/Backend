
const express = require("express");
const connectDb = require("./config/mongoDb.config");
const UserRouter = require("./routes/user.routes");

const app = express();

app.use(express.json());
connectDb();

app.use("/user", UserRouter)

app.use((req, res)=>{
    res.status(404).json({msg : "This request is not found"})
    
})


app.listen(8080, ()=>{
    console.log("Server is listening on port http://localhost:8080")
})


