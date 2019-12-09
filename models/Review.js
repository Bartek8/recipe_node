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

module.exports = mongoose.model('Review', ReviewSchema)