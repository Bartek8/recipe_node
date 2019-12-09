const Review = require("../models/Review");
const Recipe = require("../models/Recipe")
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');

// @desc    Get reviews
// @route   GET /reviews
// @route   GET /recipe/:recipeId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {

    // Fin review with ID equal recipeId
    if (req.params.recipeId) {
        const reviews = await Review.find({
            recipe: req.params.recipeId
        })

        return res.status(200).json({
            succes: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.filter);
    }
})

// @desc    Get single review
// @route   GET /reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'recipe',
        select: 'name'
    })

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

// @desc    Add review
// @route   POST /recipe/:recipeId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.recipe = req.params.recipeId
    req.body.user = req.user.id;

    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
        return next(new ErrorResponse(`No recipe with the id of ${req.params.recipeId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })
})

// @desc    Update review
// @route   PUT /reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No review with the id ${req.params.id}`, 404))
    }
    // Make sure review belongs to user or user is not admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`No authorize to update`, 404))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        success: true,
        data: review
    })
})


// @desc    Delete review
// @route   DELETE /reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No review with the id ${req.params.id}`, 404))
    }

    // Make sure review belongs to user or user is not admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`No authorize to delete`, 404))
    }

    await review.remove();

    res.status(201).json({
        success: true,
        data: {}
    })
})