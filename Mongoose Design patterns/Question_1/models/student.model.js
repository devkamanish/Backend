const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  isActive: { type: Boolean, default: true },
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;


