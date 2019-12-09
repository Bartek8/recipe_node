const express = require('express')
const {
    getRecipe,
    getRecipes,
    deleteRecipe,
    updateRecipe,
    createRecipe,
    recipePhotoUpload
} = require('../controllers/recipe')

const reviewRouter = require('./review');
const router = express.Router();

// Middleware
const {
    protect,
    authorize
} = require('../middleware/auth')
const filter = require('../middleware/filter')

// Models
const Recipe = require('../models/Recipe')

router.use('/:recipeId/reviews', reviewRouter)

// CRUD
router.route('/').get(filter(Recipe), getRecipes).post(protect, authorize('user', 'admin'), createRecipe)

router.route('/:id').get(getRecipe).put(protect, authorize('user', 'admin'), updateRecipe).delete(protect, authorize('user', 'admin'), deleteRecipe)

router.route('/:id/photo').put(protect, authorize('user', 'admin'), recipePhotoUpload)
module.exports = router;