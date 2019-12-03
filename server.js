const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/db')
const error = require('./middleware/error')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

dotenv.config({
    path: './config/config.env'
});

connectDb();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//dev login middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const recipe = require('./routes/recipe')

app.use('/recipe', recipe);

app.use(error);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.cyan))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
})