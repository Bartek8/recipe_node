const Recipe = require('../models/Recipe')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async');
const path = require('path')

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
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
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
    req.body.user = req.user.id;

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

    recipe = await Recipe.findOneAndUpdate({ _id: req.params.id }, req.body, {
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

    const model = await Recipe.findById(req.params.id);

    if (!model) {
        return next(new ErrorResponse(`No Recipe with the id ${req.params.id}`, 404))
    }

    model.remove();

    res.status(200).json({
        succes: true,
        data: {}
    })
})

// @desc    Upload photo for bootcamp
// @route   PUT /recipe/:id/photo
// @access  Private
exports.recipePhotoUpload = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    }

    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this recipe`,
                401
            )
        );
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a photo`, 404));
    }
    console.log(file.size)
    console.log(process.env.MAX_FILE_UPLOAD)
    // Check size of photo
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`, 404));
    }

    // Create custom filename
    file.name = `photo_${recipe._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Recipe.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({
            succes: true,
            data: file.name
        })
    })
})