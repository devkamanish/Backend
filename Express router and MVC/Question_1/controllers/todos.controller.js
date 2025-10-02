const { readDb, writeDb } = require("../models/todo.model");


const getAllTodos =  (req, res) => {
  let data = readDb();
  let todos = data.todos;
  res.json({ msg: "Todos", todos });
};

const postTodo =  (req, res)=>{
    let data = readDb();
    let todos = data.todos;
    let newTodo = req.body;
     let id = todos[todos.length - 1].id + 1;
     newTodo = {id, ...newTodo};
     todos.push(newTodo)
     writeDb(data)
     res.json({msg : "Todo added successfully" })
}


module.exports = {getAllTodos, postTodo}