const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.get('/me', protect, getMe);
router.post('/login', login);

module.exports = router;