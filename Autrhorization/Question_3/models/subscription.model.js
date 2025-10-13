import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: String,
  plan: String,
  startDate: Date,
  expiryDate: Date
});

export default mongoose.model("Subscription", subscriptionSchema);
