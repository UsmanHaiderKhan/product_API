const express = require('express');
const app = express();
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./helpers/connect_mongoose');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.Promise = global.Promise;

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization '
//   );

//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE');
//     return res.status(200).json({});
//   }
// });

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);

module.exports = app;
