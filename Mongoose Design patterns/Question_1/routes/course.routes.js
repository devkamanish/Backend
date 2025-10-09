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



module.exports = Courserouter;




