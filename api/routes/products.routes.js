const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/auth');
const ProductController = require('../Controllers/product.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
});
// const { result } = require('lodash');

router.get('/', ProductController.getAllProducts);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductController.postProduct
);

router.get('/:productId', ProductController.getProductById);

router.patch('/:productId', checkAuth, ProductController.updateProductById);

router.delete('/:productId', checkAuth, ProductController.deleteProductById);

module.exports = router;
