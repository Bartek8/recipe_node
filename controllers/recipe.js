const Recipe = require('../models/Recipe')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async');

// @desc    Get all recipes
// @route   GET /recipes
// @access  Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.filter)
});

// @desc    Get single recipe
// @route   GET /recipes/:id
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
        return;
    }

    res.status(200).json({
        succes: true,
        data: recipe
    })
})

// @desc    Create new recipe
// @route   POST /recipes/
// @access  Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.create(req.body);

    res.status(201).json({
        succes: true,
        data: recipe
    })
})

// @desc      Update recipe
// @route     PUT /recipe/:id
// @access    Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(
            new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
        );
    }

    recipe = await Recipe.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: recipe
    });
});

// @desc    Delete recipe
// @route   DELETE /recipe/:id
// @access  Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    }

    recipe.remove();

    res.status(200).json({
        succes: true,
        data: {}
    })
})