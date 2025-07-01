// File: tests/riskReport.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../backend/server.js'; // 👈 ESM import with .js extension

let token, reportId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register and login a test admin user
  await request(app).post('/api/auth/register').send({
    email: 'a@b.com',
    password: '123456',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'a@b.com',
    password: '123456',
  });

  token = res.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('blacklist round-trip', async () => {
  const add = await request(app)
    .post('/api/blacklist')
    .set('Authorization', `Bearer ${token}`)
    .send({ licenseNumber: 'Z999', name: 'Test', reason: 'Test' });
  expect(add.status).toBe(201);

  const list = await request(app)
    .get('/api/blacklist')
    .set('Authorization', `Bearer ${token}`);
  expect(list.body).toHaveLength(1);

  const del = await request(app)
    .delete(`/api/blacklist/${add.body._id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(del.body.message).toMatch(/Removed/);
});

test('create risk report and apply blacklist override', async () => {
  await request(app)
    .post('/api/blacklist')
    .set('Authorization', `Bearer ${token}`)
    .send({ licenseNumber: 'Z999' });

  const resp = await request(app)
    .post('/api/risk-reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Blacked Out',
      applicant: {
        name: 'John',
        dob: '1990-01-01',
        licenseNumber: 'Z999',
      },
    });

  expect(resp.status).toBe(201);
  expect(resp.body.blacklisted).toBe(true);
  expect(resp.body.riskLevel).toBe('high');

  reportId = resp.body._id;
});

test('fetch that report by id', async () => {
  const res = await request(app)
    .get(`/api/risk-reports/${reportId}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body._id).toBe(reportId);
});
