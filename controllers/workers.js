const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

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

// @desc    Update worker's name, company, and/or email
// @route   PUT /api/v1.0/workers/:id
// @access  Public
exports.updateWorker = asyncHandler(async (req, res, next) => {
  if (req.body.workOrders) {
    delete req.body.workOrders;
  }

  let worker = await Worker.findById(req.params.id);

  if (!worker) {
    return next(
      new ErrorResponse(`Worker not found with id ${req.params.id}`, 404),
    );
  }

  worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: worker });
});

// @desc    Delete worker
// @route   DELETE /api/v1.0/workers/:id
// @access  Public
exports.deleteWorker = asyncHandler(async (req, res, next) => {
  const worker = await Worker.findById(req.params.id);

  if (!worker) {
    return next(
      new ErrorResponse(`Worker not found with id ${req.params.id}`, 404),
    );
  }

  worker.workOrders.forEach(async workOrderId => {
    const workOrder = await WorkOrder.findById(workOrderId);
    workOrder.workers = workOrder.workers.filter(
      w => w.toString() !== worker._id.toString(), // eslint-disable-line no-underscore-dangle
    );
    await WorkOrder.findByIdAndUpdate(workOrderId, workOrder);
  });

  await Worker.findByIdAndDelete(req.params.id);

  return res.status(200).json({ sucess: true, data: {} });
});
