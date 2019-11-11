const express = require('express');

const { getWorkers } = require('../controllers/workers');

const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

// Middleware
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Worker, [
      ['workOrders', { title: 1, description: 1, deadline: 1 }],
    ]),
    getWorkers,
  );

module.exports = router;
