const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./helpers/connect_mongoose');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setting Header
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization '
//   );

//   if (req.method === 'OPTIONS') {
//     res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE');
//     return res.status(200).json({});
//   }
//   next();
// });
// Enable Cors
app.use(cors());
// Routes Handler
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
