const path = require('path');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

module.exports = {
  // GET : Get All the Product

  getAllProducts: (req, res, next) => {
    // const query = req.query;
    // const queryPrice = req.query.price;

    Product.find(req.query)
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              _id: doc._id,
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id,
              },
            };
          }),
        };
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
  },

  // POST : Add New Product

  postProduct: (req, res, next) => {
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    product
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'Products Created Successfully',
          createdProduct: {
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            _id: result._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + result._id,
            },
          },
        });
      })
      .catch((err) =>
        res.status(500).json({
          error: {
            error: err.message,
          },
        })
      );
  },

  // GET : Get Product By Id

  getProductById: (req, res, next) => {
    // return;
    const id = req.params.productId;
    Product.findById(id)
      .select('name price productImage _id')
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
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  },

  // PATCH : Update the Product By Id

  updateProductById: async (req, res, next) => {
    const id = req.params.productId;
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          productImage: req.body.productImage,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      updatedProduct: product,
    });
  },

  // DELETE : delete product by Id

  deleteProductById: async (req, res, next) => {
    const id = req.params.productId;
    if (id) {
      await Product.findByIdAndRemove({ _id: id })
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
