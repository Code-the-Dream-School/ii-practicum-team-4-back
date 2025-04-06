const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productsController');

// GET all products
router.get('/', getAllProducts);
// POST create a new product
router.post('/', createProduct);
// PUT update a product
router.put('/:id', updateProduct);
// DELETE a product
router.delete('/:id', deleteProduct);

module.exports = router;