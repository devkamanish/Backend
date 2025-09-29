const { count } = require("console");
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/test", (req, res) => {
  res.send("This is a test route");
});

app.get("/all-courses", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  console.log(data.courses);

  let courses = data.courses;
  res.json({ msg: "List of courses", courses });
});


app.get("/course/:id" , (req, res)=>{

console.log(req.params);

  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let courses = data.courses;

  let index = courses.findIndex((course) => course.id == req.params.id);
  if(index == -1){
    res.status(404).json({msg: "Course not found"})
  }else{
    courses.forEach((ele)=>{
      if(ele.id == req.params.id){
        res.status(200).json({msg:"Course Detail,", course: ele })
      }
    })
  }
})

//get course through query params
app.get("/course", (req, res)=>{
  console.log(req.query)

  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"))
  let courses = data.courses;
  let flag = true;

  courses.forEach((ele)=>{
    if(ele.name.includes(req.query.title)){
      flag = false;
      res.status(200).json({msg: "Course Detail", course: ele}) 
    }
  })

  if(flag){
    res.status(404).json({msg: "Course not found"}) 
  }
  
})



app.post("/add-course", (req, res) => {
  let newCourse = req.body;

  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let courses = data.courses;

  let id = courses[courses.length - 1].id + 1;
  newCourse = { ...newCourse, id };

  courses.push(newCourse);
  fs.writeFileSync("./db.json", JSON.stringify(data));

  res.json({ msg: "course added successfully" });
});

app.put("/update-course/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

  let courses = data.courses;

  const { id } = req.params;

  let index = courses.findIndex((course) => course.id == id);
  if (index == -1) {
    res.json({ msg: "Course not found" });
  } else {
    let updatedCourse = courses.map((ele) => {
      if (ele.id == id) {
        return { ...ele, ...req.body };
      } else {
        return ele;
      }
    });
    data.courses = updatedCourse;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    
    res.json({ msg: "Course updated successfully", updatedCourse });
  }
});

app.delete("/delete-course/:id", (req, res) => {
  let { id } = req.params;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  
  let courses = data.courses;
  console.log(courses);

  let index = courses.findIndex((ele) => ele.id == id);
  if (index == -1) {
    res.status(404).json({ msg: "Course not found" });
  } else {
    let updatedCourse = courses.filter((ele) => ele.id !== id);
     data.courses = updatedCourse;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.json({ msg: `Course with id ${id} deleted successfully` });
  }
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
