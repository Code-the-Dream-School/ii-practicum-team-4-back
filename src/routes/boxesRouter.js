const express = require('express');
const router = express.Router();
const { getAllBoxes, createBox, updateBox, deleteBox } = require('../controllers/boxesController');

/**
 * @swagger
 * tags:
 *   name: Boxes
 *   description: Box management
 */

// GET all boxes
/**
 * @swagger
 * /api/v1/boxes:
 *   get:
 *     summary: Get all boxes
 *     tags: [Boxes]
 *     responses:
 *       200:
 *         description: List of all boxes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Box'
 */
router.get('/', getAllBoxes);

// POST create a new box
/**
 * @swagger
 * /api/v1/boxes:
 *   post:
 *     summary: Create a new box
 *     tags: [Boxes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Box'
 *     responses:
 *       201:
 *         description: Box created
 *       400:
 *         description: Invalid input
 */
router.post('/', createBox);

// PUT update a box
/**
 * @swagger
 * /api/v1/boxes/{id}:
 *   put:
 *     summary: Update a box by ID
 *     tags: [Boxes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Box ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Box'
 *     responses:
 *       200:
 *         description: Box updated
 *       404:
 *         description: Box not found
 */
router.put('/:id', updateBox);

// DELETE a box
/**
 * @swagger
 * /api/v1/boxes/{id}:
 *   delete:
 *     summary: Delete a box by ID
 *     tags: [Boxes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Box ID
 *     responses:
 *       200:
 *         description: Box deleted
 *       404:
 *         description: Box not found
 */
router.delete('/:id', deleteBox);

module.exports = router;
