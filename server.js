const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/db')

dotenv.config({
    path: './config/config.env'
});

connectDb();

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.cyan))