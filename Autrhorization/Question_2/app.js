
const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const AuthRouter = require('./routes/auth.routes');
const BookingRouter = require('./routes/booking.routes');
require('dotenv').config();


app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=>{
    res.send("It is working")
})

app.use("/auth" , AuthRouter)
app.use("/booking" , BookingRouter)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT , ()=>console.log(`Server listening on port http://localhost:${PORT}`))
}).catch(err=>console.log("Db connection error", err))





