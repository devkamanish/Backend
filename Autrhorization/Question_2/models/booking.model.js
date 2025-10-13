const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({ 
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceName: { type: String, required: true, trim: true },
  requestedAt: { type: Date, required: true, default: Date.now }, // date/time user requested
  status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" },
  notes: { type: String }
},{ timestamps: true });

const Bookingmodel = mongoose.model("Booking", bookingSchema);

module.exports = Bookingmodel;

