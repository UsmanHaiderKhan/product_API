const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  // GET : All orders Request
  getAllOrders: (req, res, next) => {
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
  },

  // POST : Your orders Request

  postOrder: (req, res, next) => {
    // Ensure a valid ObjectId is provided
    if (!ObjectId.isValid(req.body.product)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const productId = new ObjectId(req.body.product);

    Product.findById(productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Product not Found',
          });
        }
        const order = {
          _id: new mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
        };
        return Order.create(order).then((result) => {
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
          error: err.message,
        });
      });
  },

  // GET BY ID: get order by Id

  getOrderById: (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
      .exec()
      .then((order) => {
        if (!order) {
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
  },

  // PATCH : Update the Order

  updateOrderById: (req, res, next) => {
    const id = req.params.orderId;
    Product.findByIdAndUpdate(id, req.body)
      .exec()
      .then(() => {
        res.status(200).json({
          message: 'Order has been Updated',
          request: {
            type: 'PATCH',
            url: 'http://localhost:3000/Orders/' + id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },

  // DELETE : Order By Id

  deleteOrder: async (req, res, next) => {
    const id = req.params.orderId;
    if (id) {
      await Order.findByIdAndRemove({ _id: id })
        .exec()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
          });
        });
    } else {
      console.log('Id Not Found');
    }
  },
};
