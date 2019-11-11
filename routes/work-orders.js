const express = require('express');

const Worker = require('../models/worker'); // eslint-disable-line no-unused-vars
const WorkOrder = require('../models/work-order');

const {
  getWorkOrders,
  getWorkOrder,
  addWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} = require('../controllers/work-orders');

// Include other resource routers
const workersRouter = require('./workers');

// Middleware
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

// Re-route into other resource routers
router.use('/:workOrderId/workers/:id', workersRouter);

router
  .route('/')
  .get(
    advancedResults(WorkOrder, [
      ['workers', { name: 1, companyName: 1, email: 1 }],
    ]),
    getWorkOrders,
  )
  .post(addWorkOrder);

router
  .route('/:id')
  .get(getWorkOrder)
  .put(updateWorkOrder)
  .delete(deleteWorkOrder);

module.exports = router;
