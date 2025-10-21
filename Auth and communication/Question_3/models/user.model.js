const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['user','admin','chef'], default: 'user' },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

const Usermodel = mongoose.model("User", userSchema)


module.exports = Usermodel;

