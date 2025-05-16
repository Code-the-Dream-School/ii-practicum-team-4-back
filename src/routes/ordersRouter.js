const express = require('express');
const router = express.Router();
const { getAllOrders, getOrder, createOrder, updateOrder } = require('../controllers/ordersController');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - product_id
 *         - weight
 *       properties:
 *         product_id:
 *           type: string
 *           format: ObjectId
 *         weight:
 *           type: number
 *           minimum: 1
 *     BoxItem:
 *       type: object
 *       required:
 *         - box_id
 *         - items
 *       properties:
 *         box_id:
 *           type: string
 *           format: ObjectId
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *     OrderInput:
 *       type: object
 *       required:
 *         - user_id
 *         - delivery_address
 *         - delivery_first_name
 *         - delivery_last_name
 *         - delivery_email
 *         - boxes
 *       properties:
 *         user_id:
 *           type: string
 *         delivery_address:
 *           type: string
 *         delivery_first_name:
 *           type: string
 *         delivery_last_name:
 *           type: string
 *         delivery_phone:
 *           type: string
 *         delivery_email:
 *           type: string
 *           format: email
 *         delivery_additional_info:
 *           type: string
 *         boxes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BoxItem'
 *     Order:
 *       allOf:
 *         - $ref: '#/components/schemas/OrderInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *             status:
 *               type: string
 *               enum: [pending, shipped, delivered, cancelled]
 *             totalOrderPrice:
 *               type: number
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 */


// GET all orders
/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders for the logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized access. Token is either missing or invalid.
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllOrders);

// GET a specific order
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrder);

// POST create a new order
/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request. Missing required fields or invalid data.
 *       500:
 *         description: Internal server error
 */
router.post('/', createOrder);

// PUT update an order
/**
 * @swagger
 * /api/v1/orders/{id}:
 *    put:
 *       summary: Update an order status
 *       tags: [Orders]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Order ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, shipped, delivered, cancelled]
 *       responses:
 *         200:
 *           description: Order updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Order'
 *         404:
 *           description: Order not found
 *         500:
 *           description: Internal server error
 */
router.put('/:id', updateOrder);

module.exports = router;
