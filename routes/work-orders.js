const express = require('express');

const { getWorkOrders, getWorkOrder } = require('../controllers/work-orders');

const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

// Middleware
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(WorkOrder, [
      ['workers', { name: 1, companyName: 1, email: 1 }],
    ]),
    getWorkOrders,
  );

router.route('/:id').get(getWorkOrder);

module.exports = router;
