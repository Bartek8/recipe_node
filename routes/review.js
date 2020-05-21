const express = require('express');
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/review');

const Review = require('../models/Review')
const filter = require('../middleware/filter')

const router = express.Router({
    mergeParams: true
});

// Middleware
const {
    protect,
    authorize
} = require('../middleware/auth')


// CRUD
router.route('/').get(filter(Review, {
    path: 'review',
    select: "name"
}), getReviews)
    .post(protect, authorize('user', 'admin'), addReview)

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;