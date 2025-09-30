
const express = require("express")
const courseRouter = express.Router()
const { addCourse, geAllCourses, getCourseWithID, getCourseWithQuery, editCourse, deleteCourse } = require("../controller/course.controller");

courseRouter.use(express.json());

courseRouter.get("/all-courses",geAllCourses);
courseRouter.get("/course/:id" ,getCourseWithID )
//get course through query params
courseRouter.get("/course",getCourseWithQuery );

// middle function that sits between req , res cycle
const dataCheck = (req, res, next)=>{
const {name , price} = req.body;
if(!name || !price) {
 res.status(406).json({msg : "Wrong post request"})
}else{
  next()
}
}
 
courseRouter.use(dataCheck)
courseRouter.post("/add-course", addCourse);
courseRouter.put("/update-course/:id", editCourse);
courseRouter.delete("/delete-course/:id", deleteCourse);

module.exports = courseRouter;
