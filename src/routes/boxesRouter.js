const express = require('express');
const router = express.Router();
const { getAllBoxes, createBox, updateBox, deleteBox } = require('../controllers/boxesController');

// GET all boxes
router.get('/', getAllBoxes);
// POST create a new box
router.post('/', createBox);
// PUT update a box
router.put('/:id', updateBox);
// DELETE a box
router.delete('/:id', deleteBox);

module.exports = router;
