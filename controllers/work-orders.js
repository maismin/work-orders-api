const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

// @desc    Get all work orders
// @route   GET /api/v1.0/work-orders
// @access  Public
exports.getWorkOrders = asyncHandler(async (req, res) => {
  return res.status(200).json(res.advancedResults);
});
