
const mongoose = require("mongoose")

const librarySchema = new mongoose.Schema({
    title: {type : String},
    author: {type : String}, 
    status: {type : String,default: "available"},
    borrowerName: { type: String, default: null },
    borrowDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    returnDate: { type: Date, default: null },
    overdueFees: { type: Number, default: 0 }

})


const LibraryModel = mongoose.model("Library", librarySchema)

module.exports  = LibraryModel;