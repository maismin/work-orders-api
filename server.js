require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

const express = require('express');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Boder parser
app.use(express.json());

app.use('/', (req, res) => {
  res.status(200).json({ success: true });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  ),
);

// Handle unhandled promise rejections
/* eslint-disable-next-line no-unused-vars */
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red);
  // Close server & exist process
  server.close(() => {
    process.exit(1);
  });
});
