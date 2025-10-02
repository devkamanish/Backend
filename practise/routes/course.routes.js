
const express = require("express")
const courseRouter = express.Router()
const { addCourse, geAllCourses, getCourseWithID, getCourseWithQuery, editCourse, deleteCourse } = require("../controller/course.controller");
const limiter = require("../middlewares/rateLimiter");

courseRouter.use(express.json());

courseRouter.get("/all-courses",limiter, geAllCourses);
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
 

courseRouter.post("/add-course",dataCheck,  addCourse);
courseRouter.put("/update-course/:id", editCourse);
courseRouter.delete("/delete-course/:id", deleteCourse);

module.exports = courseRouter;
