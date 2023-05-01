const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const { result } = require('lodash');

router.get('/', (req, res, next) => {
  console.log('First', res);
  Product.find()
    .select('name price _id')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id,
            },
          };
        }),
      };
      console.log(response);
      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      // res.status(404).json({
      //   message: 'No Entry Found in the database',
      // });
      // }
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
  res.status(200).json({
    message: 'Products GET Request',
  });
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));

  res.status(201).json({
    message: 'Products Created Successfully',
    createdProduct: {
      name: result.name,
      price: result.price,
      _id: result._id,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products/' + result._id,
      },
    },
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then((doc) => {
      console.log('From data base' + doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + id,
          },
        });
      } else {
        res.status(404).json({ message: 'No Valid Entry Found' });
      }
      res.status(200).json({
        message: 'Handling Post Request',
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update(
    { _id: id },
    { $set: { name: req.body.newName, price: req.body.newPrice } }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product has been Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  res.status(200).json({
    message: 'Delete Products',
  });
});

module.exports = router;
