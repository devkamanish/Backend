
const express  = require("express");
const todoRouter = require("./routes/todo.routes");

const app  = express();

app.get("/", (req, res)=>{
    res.send("<h1>Todo app</h1>")

})
app.use("/todo", todoRouter)

app.use((req, res)=>{
  res.status(404).json({msg :"This request is not found"})
})

app.listen(2000, ()=>{
    console.log("The server is listening on http://localhost:2000")
})
