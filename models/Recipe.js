const mongoose = require('mongoose');
const slugify = require('slugify');

nameLenght = 30;
instructionsLength = 1500;
descriptionLength = 500;

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Add a name"],
        trim: true, //white spaces will be trimmed
        maxlength: [nameLenght, `Name can not be more than ${nameLenght} characters`],
        unique: true
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
        minlength: [30, "Please add a longer instruction"],
        maxlength: [instructionsLength, `Instructions can not be more than ${instructionsLength} characters`]
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not be more than 5'],
        default: 1
    },
    serving: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [20, 'Serving must not be more than 20']
    },
    meat: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
        minlength: [30, "Please add a longer description"],
        maxlength: [descriptionLength, `Description can not be more than ${descriptionLength} characters`]
    },
    cousine: {
        type: [String],
        required: true,
        enum: ['Ainu',
            'Albanian',
            'Argentine',
            'Andhra',
            'Anglo-Indian',
            'Arab',
            'Armenian',
            'American',
            'Assyrian',
            'Awadhi',
            'Azerbaijani',
            'Balochi',
            'Belarusian',
            'Bangladeshi',
            'Bengali',
            'Berber',
            'Brazilian',
            'Buddhist',
            'Bulgarian',
            'Cajun',
            'Cantonese',
            'Caribbean',
            'Chechen',
            'Chinese',
            'Circassian',
            'Danish',
            'English',
            'Estonian',
            'French',
            'Filipino',
            'Georgian',
            'German',
            'Greek',
            'Indonesian',
            'Irish',
            'Italian',
            'Jamaican',
            'Japanese',
            'Jewish',
            'Korean',
            'Kurdish',
            'Mexican',
            'Mordovian',
            'Mughal',
            'Nepalese',
            'Parsi',
            'Pashtun',
            'Polish',
            'Pakistani',
            'Peranakan',
            'Persian',
            'Peruvian',
            'Portuguese',
            'Romanian',
            'Russian',
            'Sami',
            'Serbian',
            'Sindhi',
            'Slovak',
            'Slovenian',
            'Somali',
            'Spanish',
            'Taiwanese',
            'Tunisia',
            'Thai',
            'Turkish',
            'Ukrainian',
            'Vietnamese',
            'Yamal',
            'Zambian',
            'Zanzibari'
        ]
    },
    calories: {
        type: Number,
        min: [1, "The minimum value is: 1"]
    },
    time: {
        type: Number,
        min: [1, "The minimum value is: 1"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: String,
    arrayOfName: {
        type: [String]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

// Create recipe slug
RecipeSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        replacement: '-',
        lower: true,
    });

    this.arrayOfName = this.name.toLowerCase().split(' ')
    next();
});

module.exports = mongoose.model('Recipe', RecipeSchema)