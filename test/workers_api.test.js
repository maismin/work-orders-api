const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const {
  deleteData,
  importData,
  workersInDB,
  workOrdersInDB,
} = require('./test_helper');
const connectDB = require('../config/database');
const Worker = require('../models/worker');
const WorkOrder = require('../models/work-order');

const api = supertest(app);
const endpoint = '/api/v1.0/workers';

describe('getting all workers', () => {
  beforeEach(async () => {
    await deleteData();
    await importData();
  });

  it('succeeds', async () => {
    const res = await api.get(endpoint).expect(200);

    const workers = await workersInDB();
    expect(res.body.data.length).toBe(workers.length);
  });
});

describe('getting a single worker', () => {
  beforeEach(async () => {
    await deleteData();
    await importData();
  });

  it('succeeds with a valid id', async () => {
    const res = await api
      .get(`${endpoint}/5d35ea68257c1863b22501c1`)
      .expect(200);

    expect(res.body.data.name).toMatch('Alice');
    expect(res.body.data.companyName).toMatch('Apple');
    expect(res.body.data.email).toMatch('alice@apple.com');
  });

  it('fails with an invalid id', async () => {
    const res = await api
      .get(`${endpoint}/5d35ea68257c1863b22501c2`)
      .expect(404);

    expect(res.body.error).toContain(
      'not found with id 5d35ea68257c1863b22501c2',
    );
  });
});

describe('creating a worker', () => {
  beforeEach(async () => {
    await deleteData();
  });

  it('succeeds with valid fields', async () => {
    const newWorker = {
      name: 'Alice',
      companyName: 'Apple',
      email: 'Alice@apple.com',
    };

    const result = await api
      .post(endpoint)
      .send(newWorker)
      .expect(201);

    const newWorkerInDB = await Worker.findById(result.body.data.id);

    expect(newWorkerInDB.name).toBe(newWorker.name);
    expect(newWorkerInDB.companyName).toBe(newWorker.companyName);
    expect(newWorkerInDB.email).toBe(newWorker.email);
  });

  it('fails if name is missing', async () => {
    const newWorker = {
      companyName: 'Apple',
      email: 'Alice@apple.com',
    };

    const result = await api
      .post(endpoint)
      .send(newWorker)
      .expect(400);

    expect(result.body.error).toContain('Please add a name');
  });

  it('fails if company name is missing', async () => {
    const newWorker = {
      name: 'Alice',
      email: 'Alice@apple.com',
    };

    const result = await api
      .post(endpoint)
      .send(newWorker)
      .expect(400);

    expect(result.body.error).toContain('Please add a company');
  });

  it('fails if email is missing', async () => {
    const newWorker = {
      name: 'Alice',
      companyName: 'Apple',
    };

    const result = await api
      .post(endpoint)
      .send(newWorker)
      .expect(400);

    expect(result.body.error).toContain('Please add an email');
  });

  it('fails if email is not unique', async () => {
    const newWorker = {
      name: 'Alice',
      companyName: 'Apple',
      email: 'Alice@apple.com',
    };

    const newWorkerWithSameEmail = {
      name: 'Bob',
      companyName: 'Google',
      email: 'Alice@apple.com',
    };

    await api.post(endpoint).send(newWorker);

    const result = await api
      .post(endpoint)
      .send(newWorkerWithSameEmail)
      .expect(400);

    expect(result.body.error).toContain('Duplicate field value entered');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
