require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

const express = require('express');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');
const mainRouter = require('./routes');

// Connect to database
connectDB();

const app = express();

// Boder parser
app.use(express.json());

app.use(mainRouter);

app.use(errorHandler);

module.exports = app;
