const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshTokens: { type: [String], default: [] } // store issued refresh tokens
}, { timestamps: true });

const Usermodel = mongoose.model("User", userSchema);
module.exports = Usermodel;
