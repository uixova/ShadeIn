const express = require('express');
const { register, login, getMe, updateDetails, deleteMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

router.post('/forgotpassword', forgotPassword);

router.put('/updatedetails', protect, updateDetails);
router.delete('/deleteme', protect, deleteMe);

router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;