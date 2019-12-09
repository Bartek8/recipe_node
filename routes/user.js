const express = require('express');
const {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    createUser
} = require('../controllers/user');

const User = require('../models/User')
const filter = require('../middleware/filter')

const router = express.Router({
    mergeParams: true
});

router.route('/').get(filter(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router;