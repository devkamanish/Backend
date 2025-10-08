
const express = require("express");
const UserModel = require("../models/user.model");
const ProfileModel = require("../models/profile.model");
const router = express.Router()

router.post("/add-user", async (req, res)=>{
    try{
  const {name , email} = req.body;
  if(!name || !email){
    return res.status(400).json({msg: "Name and email are required"})
  }
  const user = new UserModel({name , email})
  await user.save()
  res.status(201).json({message : "User created successfully" , user})
    }catch(err){
  res.status(400).json({error : err.message})      
    }
})

router.post("/add-profile", async(req, res)=>{
    try{
    const {bio, socialMediaLinks, user} = req.body;
    const existingUser = await UserModel.findById(user);
    if(!existingUser){
        return res.status(404).json({msg: "User not found."})
    }
    
    const existingProfile = await ProfileModel.findOne({user})
    if(existingProfile){
        return res.status(400).json({msg: "Profile already exists for this user"})
    }
    const profile = new ProfileModel({bio , socialMediaLinks, user});
    await profile.save();

    res.status(201).json({msg : "Profile created successfully", profile})  
    }catch(err){
     res.status(400).json({error: err.message})
    }
})






router.get("/profiles", async(req , res)=>{
    try{
   const profiles = await ProfileModel.find().populate("user", "name email");
   res.json(profiles)
    }catch(err){
      res.status(400).json({error: err.message})
    }
})

module.exports = router;
