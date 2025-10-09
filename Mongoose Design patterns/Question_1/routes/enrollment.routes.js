const express = require('express');
const StudentModel = require('../models/student.model');
const courseModel = require('../models/course.model');
const EnrollmentModel = require('../models/enrollment.model');
const EnrollRouter = express.Router();


EnrollRouter.post("/",async (req ,res)=>{
    const {studentId, courseId} = req.body;
    try{
    const student = await StudentModel.findOne({_id: studentId, isActive : true});
    const course = await courseModel.findOne({_id: courseId, isActive: true});

   if (!student || !course) {
      return res.status(400).json({ message: 'Both student and course must be active.' });
    }
   
    const enroll = await EnrollmentModel.create({studentId, courseId})
    res.status(201).json({enroll})
    }catch (err) {
    res.status(500).json({ error: err.message });
  }

})
module.exports = EnrollRouter;



