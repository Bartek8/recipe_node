const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 200
    },
    text: {
        type: String,
        required: [true, 'Please add a text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating beetween 1 and 5']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    recipe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

ReviewSchema.index({
    recipe: 1,
    user: 1,
}, {
    unique: true
})

ReviewSchema.statics.avgRate = async function (recipeId) {
    const object = await this.aggregate([{
            $match: {
                recipe: recipeId
            }
        },
        {
            $group: {
                _id: '$recipe',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }
    ]);

    try {
        await this.model('Recipe').findByIdAndUpdate(recipeId, {
            averageRating: object[0].averageRating
        })
    } catch (err) {
        console.log(err)
    }
}

ReviewSchema.pre('save', function () {
    this.constructor.avgRate(this.recipe);
})

ReviewSchema.post('remove', function () {
    this.constructor.avgRate(this.recipe);
})

module.exports = mongoose.model('Review', ReviewSchema)