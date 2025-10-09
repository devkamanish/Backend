const express = require("express");
const studentModel = require("../models/student.model");
const EnrollmentModel = require("../models/enrollment.model");
const StudentRouter = express.Router();

StudentRouter.post("/", async (req, res) => {
  try {
    const student = await studentModel.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

StudentRouter.delete("/:id", async (req, res) => {
  try {
    const student = await studentModel.findByIdAndUpdate(req.params.id, {
      isActive: false,
    }, {new : true});
    await EnrollmentModel.updateMany(
      { studentId: req.params.id },
      { isActive: false }
    );
    res.json({
      message: "Student and related enrollments marked as inactive.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

StudentRouter.get("/:id/courses", async (req, res) => {
  try {
    const enrollments = await EnrollmentModel.find({
      studentId: req.params.id,
      isActive: true,
    }).populate({
      path: "courseId",
      match: { isActive },
    });
  } catch {}
});

module.exports = StudentRouter;


