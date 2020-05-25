const express = require('express');
const {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    createUser
} = require('../controllers/user');

const reviewRouter = require('./review')
const router = express.Router({
    mergeParams: true
});

// Middleware
const {
    protect,
    authorize
} = require('../middleware/auth')

const User = require('../models/User')

router.use('/:userId/reviews', reviewRouter)

router.route('/')
    .get(protect, authorize('admin'), getUsers)
    .post(protect, authorize('admin'), createUser);

router.route('/:id')
    .get(protect, authorize('admin'), getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser)

module.exports = router;