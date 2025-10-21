const express = require('express');
const Dish = require('../models/dish.model');
const { auth, permit } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Get dishes
 */
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Admin creates
router.post('/', auth, permit('admin'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const d = new Dish({ name, price, description });
    await d.save();
    res.status(201).json(d);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Admin update
router.put('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const d = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json(d);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Admin delete
router.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
