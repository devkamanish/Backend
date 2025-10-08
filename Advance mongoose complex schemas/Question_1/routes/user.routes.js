
const express = require("express");
const UserModel = require("../models/user.model");

const UserRouter = express.Router();

UserRouter.post("/users",async (req , res)=>{
  try{
     let  user = await UserModel.create(req.body);
      res.status(201).json({msg : "User created", user})
  }catch(err){
    res.status(500).json({msg: err.message})
  }
    
})

UserRouter.post("/users/:userId/address" ,async (req, res)=>{
    const {userId} = req.params; 
    try{
    
    let user = await UserModel.findById(userId);
    if(!user){
        res.status(401).json({msg: "user not found"})
    }else{
     user.address.push(req.body);
    await user.save()
     res.status(201).json({msg: "Address added"})
    }
    }catch(err){
    res.status(500).json({msg :"Unable to fetch user try latet"})
    }
 
})


UserRouter.get("/users/summary",async (req, res)=>{
    try{
    const users = await UserModel.find();
    const totalUser = users.length;
    const totalAdresses = users.reduce((sum, u)=> sum+u.address.length,0);
    const summaryList = users.map(u=> ({
        name  : u.name,
        addressCount : u.address.length
    }))  
    res.status(200).json({totalUser, totalAdresses, summaryList})
    }catch(err){
     res.status(500).json({error : err.message})
     console.log(err.message)
    }
})

UserRouter.get("/users/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

UserRouter.delete("/users/:userId/address/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (index < 0 || index >= user.address.length)
      return res.status(400).json({ msg: "Invalid address index" });

    user.address.splice(index, 1);
    await user.save();
  
    res.json({ msg: "Address deleted successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = UserRouter;

