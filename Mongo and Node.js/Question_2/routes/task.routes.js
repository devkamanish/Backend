const express = require('express');
const TaskRouter = express.Router();

const taskController = require('../controllers/task.controller');
const { validateCreateTask, validateUpdateTask } = require('../middlewares/task.middleware');


TaskRouter.post('/tasks', validateCreateTask, taskController.createTask);


TaskRouter.get('/tasks', taskController.getTasks);


TaskRouter.patch('/tasks/:id', validateUpdateTask, taskController.updateTask);


TaskRouter.delete('/tasks', taskController.deleteTasksByPriority);

module.exports = TaskRouter;
