const express = require("express")

const lectureRoutes = express.Router()


 lectureRoutes.get("/all-lectures", (req, res)=>{
    res.status(200).json({msg : "List of lectures"})
 })

 lectureRoutes.post("/add-lecture", (req , res)=>{
    res.status(200).json({msg : "Lecture added"})

 })


module.exports = lectureRoutes;


