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
router.get('/', getProfile);
router.post('/address', addAddress);
router.put('/address', updateAddress);
router.delete('/address', deleteAddress);

module.exports = router;