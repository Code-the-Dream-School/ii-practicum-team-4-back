const express = require('express');
const router = express.Router();
const {register, login, getCurrentUser} = require('../controllers/authController');
const authUser = require ("../middleware/authMiddleware");

router.get('/', (req, res) => {
    res.json({
        msg: 'Auth route exist'
    })
})

router.post('/register', register);
router.post('/login', login);
router.get('/current', authUser, getCurrentUser);

module.exports = router;