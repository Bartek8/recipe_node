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

const User = require('../models/User')
const filter = require('../middleware/filter')


router.use('/:userId/reviews', reviewRouter)

router.route('/')
    .get(filter(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router;