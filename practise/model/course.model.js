// Here we need to keep only DB interactions
const fs = require("fs")

const getData  = ()=>{
      let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
      let courses = data.courses;
    
      return {data , courses}
}

const addOrUpdateCourse = (data)=>{
    fs.writeFileSync("./db.json", JSON.stringify(data));
}

module.exports = {getData, addOrUpdateCourse}