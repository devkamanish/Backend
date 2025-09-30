const express = require("express");
const app = express();
const fs = require("fs");

// middleware to parse json data
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello dishes");
});

app.get("/dishes", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

  res.json({ msg: "List of dishes", dishes: data.dishes });
});

app.get("/dishes/:id", (req, res) => {
  const { id } = req.params;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let index = dishes.findIndex((dish) => dish.id == id);
  if (index == -1) {
    res.status(404).json({ msg: "Dish not found" });
  } else {
    dishes.forEach((ele) => {
      if (ele.id == id) {
        res.status(200).json({ msg: "Dish details", dish: ele });
      }
    });
  }
});

app.get("/dishes", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  // Find the first dish that matches
  let dish = dishes.find(d => d.name.toLowerCase().includes(req.query.title.toLowerCase()));
  if (dish) {
    res.status(200).json({ msg: "dish details", dish });
  } else {
    res.status(404).json({ msg: "dish not found" });
  }
});



app.put("/dishes/:id", (req, res)=>{
     
  const { id } = req.params;  
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let index  = dishes.findIndex((dish)=> dish.id == id);
  if(index ==-1){
      res.status(404).json({msg: "Dish not found"});

  }else{
     let updatedDish = dishes.map((ele)=>{
        if(ele.id == id){
            return {...ele, ...req.body};
        }else{
            return ele;
        }
     });
   
      data.dishes = updatedDish;
      fs.writeFileSync("./db.json", JSON.stringify(data));

      res.status(200).json({msg : "Dish updated successfully"});
  }

})
app.delete("/dishes/:id", (req, res) => {
  const id = Number(req.params.id); 

  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8")); 
  let dishes = data.dishes;

  let index = dishes.findIndex((dish) => dish.id === id);
  if (index === -1) {
    return res.status(404).json({ msg: "Dish not found" });
  }
  
  
  data.dishes = dishes.filter((dish) => dish.id !== id);

  fs.writeFileSync("./db.json", JSON.stringify(data));

  res.status(200).json({ msg: "Dish deleted successfully" });
});



app.post("/dishes", (req, res) => {
  let newDish = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dishes;
  let id = dishes[dishes.length - 1].id + 1;
  newDish = { id, ...newDish };
  dishes.push(newDish);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ msg: "Dish added successfully " });
});

 
 app.use((req, res)=>{
  res.status(406).json({msg: "Requested route is not present"})
 })

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
