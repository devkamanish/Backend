import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  subscription: {
    plan: { type: String, enum: ["free", "premium", "pro"], default: "free" },
    expiry: { type: Date, default: null }
  }
});

export default mongoose.model("User", userSchema);
