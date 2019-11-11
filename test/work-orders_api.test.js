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

describe('getting a single work-order', () => {
  beforeEach(async () => {
    await deleteData();
    await importData();
  });

  it('succeeds with a valid work-order id', async () => {
    const workOrderId = '5d35ed23f0db590017743b0a';
    const res = await api.get(`${endpoint}/${workOrderId}`).expect(200);

    expect(res.body.data.title).toMatch('T1');
    expect(res.body.data.description).toMatch('Task1');
    expect(res.body.data.deadline).toMatch('2021-01-01T00:00:00.000Z');
  });

  it('fails with an invalid work-order id', async () => {
    const workOrderId = '5d35ed23f0db590017743b1a';
    const res = await api.get(`${endpoint}/${workOrderId}`).expect(404);

    expect(res.body.error).toContain(`not found with id ${workOrderId}`);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
