const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const courtsRoutes = require('../routes/courtsRoutes');
const Court = require('../models/courts');

const app = express();
app.use(express.json());
app.use('/courts', courtsRoutes);

let mongoServer;

const mockCourts = [
  {
    _id: '673d219339c2b190254cd51c',
    name: "ClearOne Badminton Centre",
    address: "2368 No 5 Rd Unit 160, Richmond, BC V6X 2T1",
    image: "/images/clearone.jpg",
    coordinates: {
      lat: 49.1234,
      lng: -123.1234
    }
  },
  {
    _id: '673d219339c2b190254cd519',
    name: "Stage 18 Badminton Centre",
    address: "2351 No 6 Rd #170, Richmond, BC V6V 1P3",
    image: "/images/stage18.jpg",
    coordinates: {
      lat: 49.2345,
      lng: -123.2345
    }
  }
];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  await Court.create(mockCourts);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Courts Routes', () => {
  test('GET /courts should return all courts', async () => {
    const response = await request(app).get('/courts');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe("ClearOne Badminton Centre");
  });

  test('GET /courts/:id should return specific court', async () => {
    const response = await request(app)
      .get('/courts/673d219339c2b190254cd51c');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("ClearOne Badminton Centre");
  });

  test('GET /courts/:id with invalid id should return 400', async () => {
    const response = await request(app)
      .get('/courts/invalidid');
    expect(response.status).toBe(400);
  });

  test('GET /courts/:id with non-existent id should return 404', async () => {
    const response = await request(app)
      .get('/courts/673d219339c2b190254cd999');
    expect(response.status).toBe(404);
  });
});