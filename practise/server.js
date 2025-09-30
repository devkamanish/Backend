const { count } = require("console");
const express = require("express");
const fs = require("fs");
const courseRouter = require("./routes/course.routes")
const lectureRoutes = require("./routes/lecture.routes")

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/courses", courseRouter)

app.use("/lectures", lectureRoutes)

app.use((req, res)=>{
  res.status(404).json({msg :"This request is not found"})
})

app.listen(300, () => {
  console.log("Server is running on http://localhost:300");
});

