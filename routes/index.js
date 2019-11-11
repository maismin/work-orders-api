const express = require('express');

// Route files
const workers = require('./workers');

const mainRouter = express();

mainRouter.use('/api/v1.0/workers', workers);

module.exports = mainRouter;
