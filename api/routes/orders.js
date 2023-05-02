const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not Found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save().then((result) => {
        res.status(201).json({
          message: 'Order Has Been Created',
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: 'GET',
            url: '  http://localhost:3000/orders/' + result._id,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((order) => {
      if (!id) {
        return res.status(404).json({
          message: `Order Against this Id : ${id} not Found`,
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders' + order._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.patch('/:orderId', (req, res, next) => {
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Order Has Been Deleted SuccessFully',
        request: {
          type: 'DELETE',
          url: 'http://localhost:3000/orders/' + result._id,
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Delete Orders',
    orderId: req.params.orderId,
  });
});

module.exports = router;
