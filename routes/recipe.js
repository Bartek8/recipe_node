const express = require('express')
const {
    getRecipe,
    getRecipes,
    deleteRecipe,
    updateRecipe,
    createRecipe
} = require('../controllers/recipe')

const Recipe = require('../models/Recipe')

const filter = require('../middleware/filter')

const router = express.Router();

router.route('/').get(filter(Recipe), getRecipes).post(createRecipe)

router.route('/:id').get(getRecipe).put(updateRecipe).delete(deleteRecipe)

module.exports = router;