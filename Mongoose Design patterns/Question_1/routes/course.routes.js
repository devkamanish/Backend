const express = require('express');
const CourseModel = require('../models/course.model');
const EnrollmentModel = require('../models/enrollment.model');
const Courserouter = express.Router();


Courserouter.post("/",async (req, res)=>{
      try {
        const course = await courseModel.create(req.body);
        res.status(201).json(course);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

Courserouter.delete("/:id",async (req, res)=>{
    const {id}  = req.params;
    try{
         await CourseModel.findByIdAndUpdate(id , {isActive: false}, {new : true})
        await EnrollmentModel.updateMany({courseId: id}, {isActive : false});
            res.json({ message: 'Course and related enrollments marked as inactive.' });

    }catch(err){
    res.status(500).json({ error: err.message });

    }
})

Courserouter.get("/:id/students"  , async(req,res)=>{

    const {id} = req.params;
    try{
        let enrollments = await EnrollmentModel.find({
            courseId: id,
            isActive: true
        }, {_id:0, courseId:0, })
        res.status(200).json({msg : "Enrollments" , enrollments})
    }catch (err) {
    res.status(500).json({ msg: "Something went wrong.." });
  }
})



module.exports = Courserouter;




