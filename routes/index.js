const express = require('express');

// Route files
const workers = require('./workers');
const workOrders = require('./work-orders');

const mainRouter = express();

mainRouter.use('/api/v1.0/workers', workers);
mainRouter.use('/api/v1.0/work-orders', workOrders);

module.exports = mainRouter;
