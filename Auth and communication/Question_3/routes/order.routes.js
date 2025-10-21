const express = require('express');
const Order = require("../models/order.model")
const Dish = require('../models/dish.model');
const User = require('../models/user.model');
const { auth, permit } = require('../middleware/auth.middleware');

const router = express.Router();

// Helper: pick random chef
async function pickRandomChef() {
  const chefs = await User.find({ role: 'chef' });
  if (!chefs || chefs.length === 0) return null;
  const idx = Math.floor(Math.random() * chefs.length);
  return chefs[idx];
}

// Place order (user)
router.post('/', auth, permit('user','admin'), async (req, res) => {
  try {
    const { dishId, quantity } = req.body;
    if (!dishId) return res.status(400).json({ message: 'dishId required' });
    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const chef = await pickRandomChef();
    const order = new Order({
      user: req.user._id,
      dish: dish._id,
      quantity: quantity || 1,
      assignedChef: chef ? chef._id : undefined
    });
    await order.save();
    const populated = await Order.findById(order._id).populate('dish').populate('assignedChef','name email');
    res.status(201).json(populated);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Get my orders (user)
router.get('/me', auth, permit('user','admin'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('dish assignedChef', 'name price email');
    res.json(orders);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Chef: update status
router.put('/:id/status', auth, permit('chef'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Preparing','Out for Delivery','Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only assigned chef (or admin) may update
    if (order.assignedChef && order.assignedChef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Admin: view all
router.get('/', auth, permit('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('dish user assignedChef', 'name email price');
    res.json(orders);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
