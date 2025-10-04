
const express = require("express");
const TaskRouter = require("./routes/task.routes");
const connectDb = require("./config/db");

const app = express();
connectDb();
app.use(express.json());

app.use("/tasks", TaskRouter);

app.use("/", (req, res)=>{
 res.send("<h1> Task manager</h1>")
})
app.use((req, res)=>{
    res.status(404).json({msg: "The request is not found"})

})

app.listen(9000, ()=>{
    console.log("Server listening on port http://localhost:9000")
})



