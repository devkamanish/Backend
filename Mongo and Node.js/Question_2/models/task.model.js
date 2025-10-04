
// Model does the actual communication to the DB.
const mongooose = require("mongoose")

const TaskSchema = new mongooose.Schema({
      title: { type: String, required: true },        
  description: { type: String, required: true },
  priority: { type: String, required: true },     
  isCompleted: { type: Boolean, default: false },
  completionDate: { type: Date, default: null },
  dueDate: { type: Date, default: null }
})


const TaskModel = mongooose.model("tasks", TaskSchema)


module.exports = TaskModel