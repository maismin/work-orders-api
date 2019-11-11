require('colors');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({
  path: './config/config.env',
});

// Load models
const Worker = require('./models/worker');
const WorkOrder = require('./models/work-order');

// Connect to DB
mongoose.connect(process.env.DEV_MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const workers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/workers.json`, 'utf-8'),
);

const workOrders = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/work-orders.json`, 'utf-8'),
);

// Import data into database
const importData = async () => {
  try {
    await Worker.create(workers);
    await WorkOrder.create(workOrders);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Worker.deleteMany();
    await WorkOrder.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
