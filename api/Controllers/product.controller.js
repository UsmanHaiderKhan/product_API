const path = require('path');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

module.exports = {
  // GET : Get All the Product

  getAllProducts: (req, res, next) => {
    Product.find()
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

  updateProductById: (req, res, next) => {
    const id = req.params.productId;
    console.log('ID REocrd:' + req.body);
    // const updateOps = {};
    // for (const ops of req.body) {
    //   updateOps[ops.propName] = ops.value;
    // }
    Product.findByIdAndUpdate(
      id,
      req.body
      // { _id: id },
      // {
      //   $set: {
      //     name: req.body.name,
      //     price: req.body.price,
      //     productImage: req.body.productImage,
      //   },
      // }
    )
      .exec()
      .then(() => {
        res.status(200).json({
          message: 'Product has been Updated',
          request: {
            type: 'PATCH',
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
