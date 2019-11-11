const express = require('express');

const {
  getWorkers,
  getWorker,
  addWorker,
  updateWorker,
} = require('../controllers/workers');

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
  )
  .post(addWorker);

router
  .route('/:id')
  .get(getWorker)
  .put(updateWorker);

module.exports = router;
