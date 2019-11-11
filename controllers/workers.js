const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Worker = require('../models/worker');

// @desc    Get all workers
// @route   GET /api/v1.0/workers
// @access  Public
exports.getWorkers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
