const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Worker = require('../models/worker');

// @desc    Get all workers
// @route   GET /api/v1.0/workers
// @access  Public
exports.getWorkers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single worker
// @route   GET /api/v1.0/workers/:id
// @access  Public
exports.getWorker = asyncHandler(async (req, res, next) => {
  const worker = await Worker.findById(req.params.id).populate('workOrders', {
    title: 1,
    description: 1,
    deadline: 1,
  });

  if (!worker) {
    return next(
      new ErrorResponse(`Worker not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: worker });
});

// @desc    Add worker
// @route   POST /api/v1.0/workers
// @access  Public
exports.addWorker = asyncHandler(async (req, res, next) => {
  const worker = await Worker.create(req.body);
  res.status(201).json({ success: true, data: worker });
});
