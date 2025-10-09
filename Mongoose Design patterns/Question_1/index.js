const express = require("express");
const mongoose = require("mongoose");
const StudentRouter = require("./routes/student.routes");
const Courserouter = require("./routes/course.routes");
const EnrollRouter = require("./routes/enrollment.routes");
const app = express();

app.use(express.json());

app.use("/students", StudentRouter);
app.use("/courses", Courserouter);
app.use("/enroll", EnrollRouter);

const PORT = process.env.PORT || 5000;
mongoose
  .connect("mongodb://127.0.0.1:27017/student-course-db")
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));


