const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/db')
const error = require('./middleware/error')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');

dotenv.config({
    path: './config/config.env'
});

connectDb();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }))

app.use(fileupload())

app.use(cors())

app.use(mongoSanitize());

app.use(helmet())

app.use(xssClean())

app.use(hpp())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//dev login middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const recipe = require('./routes/recipe')
const auth = require('./routes/auth')
const user = require('./routes/user')
const review = require('./routes/review')

app.use('/recipe', recipe);
app.use('/auth', auth)
app.use('/user', user)
app.use('/reviews', review)

app.use(error);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.cyan))

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
})