const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const Notesmodel = require("../models/notes.model");

const NotesRouter = express.Router();

NotesRouter.post("/", authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    const noteData = { ...req.body, createdBy: req.user };
    let note = await Notesmodel.create(noteData);
    res.status(200).json({ msg: "Note added", note });
  } catch {
    res.status(500).json({ msg: "Something went wrong" });
  }
});


//  Read Note (Read Own Notes)
NotesRouter.get("/",authMiddleware, async (req, res) => {
  try {
    const notes = await Notesmodel.find({ createdBy: req.user });
    res.status(200).json({ notes });
  } catch {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

//  UPDATE Note (Only Own Notes)
NotesRouter.put('/:id',authMiddleware, async (req , res)=>{
    const noteId   = req.params.id;
    const userId = req.user;

    try{
   const note = await Notesmodel.findOne({ _id: noteId});
   if(!note){
   return res.status(404).json({msg : "Note not found"})
   }

   if(note.createdBy.toString() !== userId){
    return res.status(403).json({msg:"Not authorized to update this note"})
   }
  
   const updatedNote = await Notesmodel.findByIdAndUpdate(noteId,req.body, {new: true} );
   res.status(200).json({msg : "Notes updated", note:updatedNote})
    }catch{
        res.status(500).json({ msg: "Something went wrong" });
    }
})

//  DELETE Note (Only Own Notes)
NotesRouter.delete("/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user;

  try {
    const note = await Notesmodel.findOne({ _id: noteId });

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.createdBy.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized to delete this note" });
    }

    await Notesmodel.findByIdAndDelete(noteId);
    res.status(200).json({ msg: "Note deleted" });
  } catch {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
module.exports = NotesRouter;


