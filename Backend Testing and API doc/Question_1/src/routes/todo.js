const express = require('express');
const { Todo } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Create
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;
  const todo = await Todo.create({ title, description, status, userId: req.user.userId });
  res.status(201).json(todo);
});

// Read
router.get('/', async (req, res) => {
  const todos = await Todo.findAll({ where: { userId: req.user.userId } });
  res.json(todos);
});

// Update
router.put('/:id', async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (!todo || todo.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

  await todo.update(req.body);
  res.json(todo);
});

// Delete
router.delete('/:id', async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (!todo || todo.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

  await todo.destroy();
  res.status(204).send();
});

module.exports = router;
