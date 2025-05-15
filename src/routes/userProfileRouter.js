const express = require('express');
const router = express.Router();

const {
    getProfile,
    addAddress,
    updateAddress,
    deleteAddress,
} = require('../controllers/profileController');

const authenticateUser = require('../middleware/authMiddleware');

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile and address management
 */

//GET current user's profile
/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
router.get('/', getProfile);

//POST - add new address
/**
 * @swagger
 * /api/v1/profile/address:
 *   post:
 *     summary: Add new address to user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address added
 *       400:
 *         description: Validation error
 */
router.post('/address', addAddress);

//PUT - update existing address
/**
 * @swagger
 * /api/v1/profile/address:
 *   put:
 *     summary: Update existing address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 required: [index]
 *                 properties:
 *                   index:
 *                     type: number
 *                     example: 0
 *               - $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated
 *       404:
 *         description: Address not found
 */
router.put('/address', updateAddress);

//DELETE an address
/**
 * @swagger
 * /api/v1/profile/address:
 *   delete:
 *     summary: Delete an address by index
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - index
 *             properties:
 *               index:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 */
router.delete('/address', deleteAddress);

module.exports = router;