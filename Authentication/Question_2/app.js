const express = require("express");
const connecToMongoDb = require("./configs/mongoDb.config");
const UserRouter = require("./routes/user.routes");
const NotesRouter = require("./routes/notes.routes");

require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
connecToMongoDb();

app.get("/test", (req, res) => {
  res.status(200).send("<h1>It is working</h1>");
});

app.use("/user", UserRouter);
app.use("/notes", NotesRouter);

app.use((req, res) => {
  res.status(404).json({ msg: "This request is not found" });
});
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});





