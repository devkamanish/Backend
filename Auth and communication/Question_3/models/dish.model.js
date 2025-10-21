const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

const Dishmodel = mongoose.model("Dish" , dishSchema)

module.exports = Dishmodel;

