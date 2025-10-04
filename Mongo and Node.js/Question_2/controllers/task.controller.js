
const Task = require('../models/task.model');


const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, isCompleted } = req.body;

    
    
    const existing = await Task.findOne({ title: { $regex: `^${escapeRegExp(title)}$`, $options: 'i' }});
    if (existing) {
      return res.status(409).json({ message: 'A task with this title already exists' });
    }

    const taskData = { title, description, priority };

    if (dueDate) {
      const date = new Date(dueDate);
      if (!isNaN(date)) taskData.dueDate = date;
    }

    
    if (isCompleted === true) {
      taskData.isCompleted = true;
      taskData.completionDate = new Date();
    } else {
      taskData.isCompleted = false;
      taskData.completionDate = null;
    }

    const created = await Task.create(taskData);
    return res.status(201).json({ message: 'Task created', task: created });
  } catch (err) {
    console.error('createTask error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


const getTasks = async (req, res) => {
  try {
    const { priority, status } = req.query;
    const filter = {};

    if (priority) {
      filter.priority = priority.trim();
    }

    if (status) {
      if (status === 'completed') filter.isCompleted = true;
      else if (status === 'pending') filter.isCompleted = false;
      else {
        return res.status(400).json({ message: "Invalid status query. Allowed: 'completed' or 'pending'." });
      }
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ count: tasks.length, tasks });
  } catch (err) {
    console.error('getTasks error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = {};
    const { title, priority, description, isCompleted, dueDate } = req.body;

    if (title !== undefined) allowed.title = title;
    if (priority !== undefined) allowed.priority = priority;
    if (description !== undefined) allowed.description = description;
    if (dueDate !== undefined) {
      const d = new Date(dueDate);
      if (!isNaN(d)) allowed.dueDate = d;
      else return res.status(400).json({ message: 'Invalid dueDate' });
    }

    if (isCompleted !== undefined) {
      allowed.isCompleted = isCompleted;
      if (isCompleted === true) allowed.completionDate = new Date();
      else allowed.completionDate = null;
    }

    
    if (allowed.title) {
      const existing = await Task.findOne({
        _id: { $ne: id },
        title: { $regex: `^${escapeRegExp(allowed.title)}$`, $options: 'i' }
      });

      if (existing) {
        return res.status(409).json({ message: 'Another task with this title already exists' });
      }
    }

    const updated = await Task.findByIdAndUpdate(id, allowed, { new: true });

    if (!updated) return res.status(404).json({ message: 'Task not found' });

    return res.status(200).json({ message: 'Task updated', task: updated });
  } catch (err) {
    console.error('updateTask error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


const deleteTasksByPriority = async (req, res) => {
  try {
    const { priority } = req.query;
    if (!priority) {
      return res.status(400).json({ message: 'priority query parameter is required for bulk deletion' });
    }

    
    const allowed = ['low', 'medium', 'high'];
    if (!allowed.includes(priority.trim())) {
      return res.status(400).json({ message: 'Invalid priority filter. Allowed: low, medium, high' });
    }

    const result = await Task.deleteMany({ priority: priority.trim() });
    return res.status(200).json({ message: `Deleted ${result.deletedCount} task(s) with priority '${priority.trim()}'` });
  } catch (err) {
    console.error('deleteTasksByPriority error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTasksByPriority
};
