const express = require("express");

const app = express();

const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
  { id: 3, name: "Bob Smith", email: "bob@example.com" }
];


app.get("/", (req , res)=>{  
  
  res.send(("Hello world"))
 })

app.get("/users/get", (req , res)=>{
    res.status(200).json(users[0]);

})  

app.get("/users/list", (req , res)=>{
     res.status(200).json(users);

})

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});


app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
