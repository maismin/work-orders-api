const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const {
  deleteData,
  importData,
  workersInDB,
  workOrdersInDB,
} = require('./test_helper');
const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

const api = supertest(app);
const endpoint = '/api/v1.0/work-orders';

describe('getting all work-orders', () => {
  beforeEach(async () => {
    await deleteData();
    await importData();
  });

  it('succeeds', async () => {
    const res = await api.get(endpoint).expect(200);
    const workOrders = await workOrdersInDB();

    expect(res.body.data.length).toBe(workOrders.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
