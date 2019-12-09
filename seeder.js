const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({
    path: './config/config.env'
});

const Recipe = require('./models/Recipe')
const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const recipes = JSON.parse(fs.readFileSync(`${__dirname}/_data/recipes.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

const importData = async () => {
    try {
        await Recipe.create(recipes);
        await User.create(users);
        console.log("Data imported...".green.inverse)
    } catch (err) {
        console.log(err)
    }
}

const deleteData = async () => {
    try {
        await Recipe.deleteMany();
        await User.deleteMany();
        console.log("Data destroyed...".red.inverse)
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === "-i") {
    importData();
}
if (process.argv[2] === "-d") {
    deleteData();
}