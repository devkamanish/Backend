require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const logger = require('./middleware/logger.middleware');
const authRoutes = require('./routes/auth.routes');
const dishRoutes = require('./routes/dish.routes');
const orderRoutes = require('./routes/order.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> app.listen(PORT, ()=> console.log(`Server ${PORT}`)))
  .catch(err => { console.error(err); process.exit(1); });

