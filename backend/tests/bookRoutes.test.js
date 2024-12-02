const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const moment = require('moment');
const Booking = require('../models/booking');
const Court = require('../models/courts');
const bookRoutes = require('../routes/bookRoutes');

const app = express();
app.use(express.json());
app.use('/bookings', bookRoutes);

describe('Booking Routes', () => {
  let mongoServer;
  let testCourtId;
  let testUserId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Booking.deleteMany({});
    await Court.deleteMany({});

    const court = await Court.create({
      name: 'Test Court',
      address: '123 Test St',
      image: '/test.jpg',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    });

    testCourtId = court._id;
    testUserId = new mongoose.Types.ObjectId();
  });

  describe('POST /bookings/book', () => {
    test('should create a new booking successfully', async () => {
      const date = moment().format('YYYY-MM-DD'); // Use strict date format
      const timeSlot = '8:00-9:00'; // Valid time slot format

      const res = await request(app)
        .post('/bookings/book')
        .send({
          userId: testUserId,
          courtId: testCourtId,
          date,
          timeSlot,
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Booking successful');
      expect(res.body.booking).toHaveProperty('courtName', 'Test Court');
    });
  });

  describe('GET /bookings/history/:userId', () => {
    beforeEach(async () => {
      const date = moment().startOf('day').toDate();
      const timeSlot = new Date(date);
      timeSlot.setHours(8, 0, 0, 0);

      await Booking.create({
        userId: testUserId,
        courtId: testCourtId,
        date,
        timeSlot,
        status: 'confirmed',
      });
    });

    test('should get booking history for user', async () => {
      const res = await request(app)
        .get(`/bookings/history/${testUserId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
    });
  });

  describe('DELETE /bookings/:id', () => {
    let bookingId;

    beforeEach(async () => {
      const date = moment().startOf('day').toDate();
      const timeSlot = new Date(date);
      timeSlot.setHours(8, 0, 0, 0);

      const booking = await Booking.create({
        userId: testUserId,
        courtId: testCourtId,
        date,
        timeSlot,
        status: 'confirmed',
      });
      bookingId = booking._id;
    });

    test('should cancel booking successfully', async () => {
      const res = await request(app)
        .delete(`/bookings/${bookingId}`);

      expect(res.status).toBe(200);
      expect(res.body.booking.status).toBe('cancelled');
    });
  });
});