const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const OrderController = require('../Controllers/order.controller');

router.get('/', checkAuth, OrderController.getAllOrders);

router.post('/', checkAuth, OrderController.postOrder);

router.get('/:orderId', checkAuth, OrderController.getOrderById);

router.patch('/:orderId', checkAuth, OrderController.updateOrderById);

router.delete('/:orderId', checkAuth, OrderController.deleteOrder);

module.exports = router;
