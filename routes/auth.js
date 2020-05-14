const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    update,
    updatePassword,
    resetPassword
} = require('../controllers/auth')

const router = express.Router();

const {
    protect
} = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/logout', logout)
router.put('/update', protect, update)
router.put('/updatepassword', protect, updatePassword)
router.get('/login/resetpassword', resetPassword)

module.exports = router;