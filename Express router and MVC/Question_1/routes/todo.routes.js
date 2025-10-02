const express = require("express");
const { postTodo, getAllTodos } = require("../controllers/todos.controller");
const todoRouter = express.Router();

todoRouter.use(express.json());

todoRouter.get("/todos",getAllTodos);


todoRouter.post("/todos",postTodo)


module.exports = todoRouter;
