const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  quantity: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['Order Received','Preparing','Out for Delivery','Delivered'],
    default: 'Order Received'
  },
  assignedChef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const  Ordermodel = mongoose.model("Order", orderSchema)

module.exports = Ordermodel;

