const { getData, addOrUpdateCourse } = require("../model/course.model");

const geAllCourses = (req, res) => {
  let courses = getData().courses;
  res.json({ msg: "List of courses", courses });
};

const getCourseWithID = (req, res) => {
  let courses = getData().courses;

  let index = courses.findIndex((course) => course.id == req.params.id);
  if (index == -1) {
    res.status(404).json({ msg: "Course not found" });
  } else {
    courses.forEach((ele) => {
      if (ele.id == req.params.id) {
        res.status(200).json({ msg: "Course Detail,", course: ele });
      }
    });
  }
};

const getCourseWithQuery = (req, res)=>{
  console.log(req.query)

  let courses = getData().courses
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
  
};

const addCourse = (req, res) => {
  let newCourse = req.body;
  let data = getData().data;
  let courses = getData().courses;
  let id = courses[courses.length - 1].id + 1;
  newCourse = { id, ...newCourse };
  courses.push(newCourse);
  data.courses = courses;
  addOrUpdateCourse(data);
  res.json({ msg: "course added successfully" });
};

const editCourse = (req, res) => {

  let courses = getData().courses;
  let data = getData().data;
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
    addOrUpdateCourse(data)
    res.json({ msg: "Course updated successfully", updatedCourse });
  }
}

const deleteCourse = (req, res) => {
  let  id  = Number(req.params.id);
  let data = getData().data;
  let courses = getData().courses
  let index = courses.findIndex((ele) => ele.id === id);
  if (index == -1) {
    res.status(404).json({ msg: "Course not found" });
  } else {
    let updatedCourse = courses.filter((ele) => ele.id !== id);
     data.courses = updatedCourse;
     addOrUpdateCourse(data)
    res.json({ msg: `Course with id ${id} deleted successfully` });
  }
};

module.exports = { geAllCourses, addCourse, getCourseWithID,getCourseWithQuery,editCourse ,deleteCourse};
