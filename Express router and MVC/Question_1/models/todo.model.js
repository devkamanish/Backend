
const fs = require("fs")


const readDb = ()=>{
    let data = JSON.parse(fs.readFileSync("./db.json" , "utf-8"))
   return data;
}

const writeDb = (data)=>{
    fs.writeFileSync("./db.json", JSON.stringify(data))
}

module.exports = {readDb, writeDb}


