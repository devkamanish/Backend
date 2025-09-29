

const express = require('express');
const readFileContent = require("./read")
const os = require("os")
const dns = require("dns")

const app = express();



app.get("/test", (req , res)=>{
    res.send("Test route is working!")

})

app.get("/readfile",(req , res)=>{
     res.send(readFileContent("./data.txt"))
})

app.get("/systemdetails" , (req, res)=>{
    const systemInfo = {
       platform: os.platform(),
        totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`,
        cpuModel: os.cpus()[0].model,
        cpuCores: os.cpus().length  // Bonus: Core count
    };
    res.json(systemInfo);


})

app.get("/getip" , (req, res)=>{
     dns.lookup("masaischool.com", (err, address, family) => {
        if (err) {
            return res.json({ error: "Unable to resolve hostname" });
        }
        res.json({
            hostname: "masaischool.com",
            ipAddress: address,
            family: `IPv${family}`
        });
    });
})

app.listen(3000, ()=>{
  console.log("Server is running on http://localhost:3000");
})