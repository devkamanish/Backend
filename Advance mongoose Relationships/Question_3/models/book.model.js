
const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {type : String, required: true, minlength:3},
    author : {type :String, required: true},
    status: {type: String, enum:["available", "borrowed"] },
    borrowers :[
        {type: mongoose.Schema.Types.ObjectId, ref: "Member"}
    ], 
    createdAt: {type : Date , default: Date.now()} 

})


const BookModel= mongoose.model("Book", bookSchema)

module.exports = BookModel;
