const express = require('express');
const router = express.Router();
const { getAllOrders, getOrder, createOrder, updateOrder } = require('../controllers/ordersController');

// GET all orders
router.get('/', getAllOrders);
// GET a specific order
router.get('/:id', getOrder);
// POST create a new order
router.post('/', createOrder);
// PUT update an order
router.put('/:id', updateOrder);

module.exports = router;
