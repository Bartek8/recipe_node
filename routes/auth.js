const express = require('express');
const {
    register,
    login,
    getMe,
    update,
    updatePassword,
} = require('../controllers/auth')

const router = express.Router();

const {
    protect
} = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/update', protect, update)
router.put('/updatepassword', protect, updatePassword)

module.exports = router;