const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./configs/db');
const libraryRoutes = require('./routes/library.routes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); 

app.use(bodyParser.json());
app.use('/library', libraryRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: 'Internal server error', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
