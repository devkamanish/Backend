const express = require("express");
const Bookingmodel = require("../models/booking.model");
const authMiddleware = require("../middlewares/auth.middleware");

const BookingRouter = express.Router()



BookingRouter.post("/bookings", authMiddleware(),  async(req , res)=>{
    try {
          const { serviceName, requestedAt, notes } = req.body;
    if (!serviceName || !requestedAt) {
      return res.status(400).json({ message: "serviceName and requestedAt are required" });
    }
   const booking = new Bookingmodel({
    user: req.user.id,
    serviceName, 
    requestedAt : new Date(requestedAt),
    notes
   })
   
   await booking.save();
     return res.status(201).json({ message: "Booking created", booking });

}  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }

})

BookingRouter.get("/bookings" , authMiddleware(),  async(req, res)=>{
    try {
        let bookings ;
        if(req.user.role == "admin"){
            bookings = (await Bookingmodel.find().populate("user" ,"username email role -_id"));
        }else{
            bookings = await Bookingmodel.find({user: req.user.id})
        }
        res.json({bookings})
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})



BookingRouter.put("/bookings/:id", authMiddleware(), async (req, res) => {
  try {
    const booking = await Bookingmodel.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed to update this booking" });

    if (booking.status !== "pending")
      return res.status(400).json({ message: "Only pending bookings can be updated" });

    const { serviceName, requestedAt, notes } = req.body;
    if (serviceName) booking.serviceName = serviceName;
    if (requestedAt) booking.requestedAt = new Date(requestedAt);
    if (notes !== undefined) booking.notes = notes;
   
    await booking.save();
    res.json({ message: "Booking updated successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

BookingRouter.delete("/bookings/:id", authMiddleware(), async (req, res) => {
  try {
    const booking = await Bookingmodel.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed to cancel this booking" });

    if (booking.status !== "pending")
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


BookingRouter.patch("/bookings/:id/approve", authMiddleware("admin"), async (req, res) => {
  try {
    const booking = await Bookingmodel.findById(req.params.id).populate("user", "username email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "pending")
      return res.status(400).json({ message: "Only pending bookings can be approved" });

    booking.status = "approved";
    await booking.save();
    res.json({ message: "Booking approved", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Reject booking (admin)
BookingRouter.patch("/bookings/:id/reject", authMiddleware("admin"), async (req, res) => {
  try {
    const booking = await Bookingmodel.findById(req.params.id).populate("user", "username email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "pending")
      return res.status(400).json({ message: "Only pending bookings can be rejected" });

    booking.status = "rejected";
    await booking.save();
    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

BookingRouter.delete("/bookings/:id/admin", authMiddleware("admin"), async (req, res) => {
  try {
    const booking = await Bookingmodel.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await Bookingmodel.deleteOne({ _id: booking._id });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = BookingRouter;



