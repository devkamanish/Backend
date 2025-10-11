const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Blogmodel = mongoose.model("Blogs" , blogSchema)

module.exports = Blogmodel;

