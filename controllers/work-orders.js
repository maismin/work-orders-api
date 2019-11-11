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

// @desc    Get single work order
// @route   GET /api/v1.0/work-orders/:id
// @access  Public
exports.getWorkOrder = asyncHandler(async (req, res, next) => {
  const workOrder = await WorkOrder.findById(req.params.id).populate(
    'workers',
    {
      name: 1,
      companyName: 1,
      email: 1,
    },
  );

  if (!workOrder) {
    return next(
      new ErrorResponse(`Work order not found with id ${req.params.id}`, 404),
    );
  }

  return res.status(200).json({ success: true, data: workOrder });
});

// @desc    Add work order
// @route   POST /api/v1.0/work-orders
// @access  Public
exports.addWorkOrder = asyncHandler(async (req, res) => {
  if (req.body.workers) {
    delete req.body.workers;
  }

  const workOrder = await WorkOrder.create(req.body);
  return res.status(201).json({ success: true, data: workOrder });
});

// @desc    Update work order's title, description, and/or deadline
// @route   PUT /api/v1.0/work-orders/:id
// @access  Public
exports.updateWorkOrder = asyncHandler(async (req, res, next) => {
  if (req.body.workers) {
    delete req.body.workers;
  }

  let workOrder = await WorkOrder.findById(req.params.id);

  if (!workOrder) {
    return next(
      new ErrorResponse(`Work order not found with id ${req.params.id}`, 404),
    );
  }

  workOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, data: workOrder });
});

// @desc    Delete work order
// @route   DELETE /api/v1.0/work-orders/:id
// @access  Public
exports.deleteWorkOrder = asyncHandler(async (req, res, next) => {
  const workOrder = await WorkOrder.findById(req.params.id);

  if (!workOrder) {
    return next(
      new ErrorResponse(`WorkOrder not found with id ${req.params.id}`, 404),
    );
  }

  workOrder.workers.forEach(async workerId => {
    const worker = await Worker.findById(workerId);
    worker.workOrders = worker.workOrders.filter(
      w => w.toString() !== workOrder._id.toString(), // eslint-disable-line no-underscore-dangle
    );
    await Worker.findByIdAndUpdate(workerId, worker);
  });

  await WorkOrder.findByIdAndDelete(req.params.id);

  return res.status(200).json({ sucess: true, data: {} });
});
