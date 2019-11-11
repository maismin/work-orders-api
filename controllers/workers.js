const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

// @desc    Get all workers
// @route   GET /api/v1.0/workers
// @access  Public
exports.getWorkers = asyncHandler(async (req, res) => {
  return res.status(200).json(res.advancedResults);
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

  return res.status(200).json({ success: true, data: worker });
});

// @desc    Add worker
// @route   POST /api/v1.0/workers
// @access  Public
exports.addWorker = asyncHandler(async (req, res) => {
  if (req.body.workOrders) {
    delete req.body.workOrders;
  }

  const worker = await Worker.create(req.body);
  return res.status(201).json({ success: true, data: worker });
});

// @desc    Update worker's name, company, and/or email
// @route   PUT /api/v1.0/workers/:id
// @route   PUT /api/v1.0/work-orders/:workOrderId/workers/:id
// @access  Public
exports.updateWorker = asyncHandler(async (req, res, next) => {
  if (req.body.workOrders) {
    delete req.body.workOrders;
  }

  const { id, workOrderId } = req.params;

  let worker = await Worker.findById(id);

  if (!worker) {
    return next(new ErrorResponse(`Worker not found with id ${id}`, 404));
  }

  if (req.body) {
    worker = await Worker.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  if (workOrderId) {
    const workOrder = await WorkOrder.findById(workOrderId);

    if (!workOrder) {
      return next(
        new ErrorResponse(`Work order not found with id ${workOrderId}`, 404),
      );
    }

    // Check if worker is already added to the work order
    if (
      workOrder.workers.some(w => w._id.toString() === worker._id.toString()) // eslint-disable-line no-underscore-dangle
    ) {
      return next(
        new ErrorResponse(
          `Duplicate worker ${id} in work order ${workOrderId}`,
          400,
        ),
      );
    }

    try {
      workOrder.workers = workOrder.workers.concat(worker._id); // eslint-disable-line no-underscore-dangle
      await workOrder.save();
      worker.workOrders = worker.workOrders.concat(workOrder._id); // eslint-disable-line no-underscore-dangle
      await worker.save();
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  }

  worker = await Worker.findById(req.params.id).populate('workOrders', {
    title: 1,
    description: 1,
    deadline: 1,
  });

  return res.status(200).json({ success: true, data: worker });
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
