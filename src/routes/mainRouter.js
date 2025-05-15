const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController.js');

/**
 * @swagger
 * tags:
 *   name: Main
 *   description: Main entry point
 */

//Main route
/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: Main route to check API status
 *     tags: [Main]
 *     responses:
 *       200:
 *         description: API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Welcome to the Farm2You API
 */
router.get('/', mainController.get);
  
module.exports = router;
