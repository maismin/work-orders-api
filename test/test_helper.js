const fs = require('fs');

const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

const deleteData = async () => {
  try {
    await Worker.deleteMany();
    await WorkOrder.deleteMany();
  } catch (error) {
    console.error(error);
  }
};

const importData = async () => {
  try {
    // Read JSON files
    const workers = JSON.parse(
      fs.readFileSync(`${__dirname}/../_data/workers.json`, 'utf-8'),
    );

    const workOrders = JSON.parse(
      fs.readFileSync(`${__dirname}/../_data/work-orders.json`, 'utf-8'),
    );

    await Worker.create(workers);
    await WorkOrder.create(workOrders);
  } catch (error) {
    console.error(error);
  }
};

const workersInDB = async () => {
  const workers = await Worker.find({});
  return workers.map(worker => worker.toJSON());
};

const workOrdersInDB = async () => {
  const workOrders = await WorkOrder.find({});
  return workOrders.map(workOrder => workOrder.toJSON());
};

module.exports = {
  deleteData,
  importData,
  workersInDB,
  workOrdersInDB,
};
