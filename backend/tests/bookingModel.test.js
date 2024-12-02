const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const User = require('../models/User');
const Court = require('../models/courts');

jest.setTimeout(30000);

describe('Booking Model', () => {
  let testUser;
  let testCourt;

  beforeAll(async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      await mongoose.connect(process.env.MONGO_URI);
      
      // Clear existing test data
      await User.deleteMany({ username: 'testbookinguser' });
      await Court.deleteMany({ name: 'Test Booking Court' });
      await Booking.deleteMany({});
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      // Create test user with unique username
      testUser = await User.create({
        username: 'testbookinguser',
        email: 'testbooking@example.com',
        password: 'password123',
        displayName: 'Test Booking User'
      });

      // Create test court with all required fields
      testCourt = await Court.create({
        name: 'Test Booking Court',
        address: '123 Test Street',
        coordinates: {
          lat: 49.2345,
          lng: -123.2345
        },
        image: '/images/test-court.jpg'
      });
    } catch (error) {
      console.error('Failed to create test data:', error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      // Clean up test data after each test
      await User.findByIdAndDelete(testUser?._id);
      await Court.findByIdAndDelete(testCourt?._id);
      await Booking.deleteMany({});
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error('Failed to close database connection:', error);
    }
  });

  it('should create a valid booking', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    const validBooking = {
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot,
      status: 'confirmed'
    };

    const savedBooking = await Booking.create(validBooking);
    expect(savedBooking._id).toBeDefined();
    expect(savedBooking.userId.toString()).toBe(testUser._id.toString());
    expect(savedBooking.courtId.toString()).toBe(testCourt._id.toString());
    expect(savedBooking.status).toBe('confirmed');
    expect(savedBooking.date.toISOString().split('T')[0]).toBe('2024-12-01');
    expect(savedBooking.timeSlot.toISOString()).toBe('2024-12-01T10:00:00.000Z');
  });

  it('should fail without required fields', async () => {
    const invalidBooking = new Booking({});
    
    let error;
    try {
      await invalidBooking.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
    expect(error.errors.courtId).toBeDefined();
    expect(error.errors.timeSlot).toBeDefined();
  });

  it('should have default status as confirmed', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    const booking = await Booking.create({
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot
    });

    expect(booking.status).toBe('confirmed');
  });

  it('should fail with invalid status', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    const invalidBooking = {
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot,
      status: 'invalid_status'
    };

    let error;
    try {
      await Booking.create(invalidBooking);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('should find booking by userId', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    const booking = await Booking.create({
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot
    });

    const foundBookings = await Booking.find({ userId: testUser._id });
    expect(foundBookings).toHaveLength(1);
    expect(foundBookings[0]._id.toString()).toBe(booking._id.toString());
    expect(foundBookings[0].date.toISOString().split('T')[0]).toBe('2024-12-01');
    expect(foundBookings[0].timeSlot.toISOString()).toBe('2024-12-01T10:00:00.000Z');
  });

  it('should update booking status', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    const booking = await Booking.create({
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot,
      status: 'confirmed'
    });

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { status: 'cancelled' },
      { new: true }
    );

    expect(updatedBooking.status).toBe('cancelled');
  });

  it('should delete booking', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    const booking = await Booking.create({
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot
    });

    await Booking.findByIdAndDelete(booking._id);
    const foundBooking = await Booking.findById(booking._id);
    expect(foundBooking).toBeNull();
  });

  it('should populate court and user references', async () => {
    const bookingDate = new Date('2024-12-01');
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    // 验证测试数据存在
    const existingUser = await User.findById(testUser._id);
    const existingCourt = await Court.findById(testCourt._id);
    
    expect(existingUser).toBeDefined();
    expect(existingCourt).toBeDefined();

    const booking = await Booking.create({
      userId: testUser._id,
      courtId: testCourt._id,
      date: bookingDate,
      timeSlot: timeSlot
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId')
      .populate('courtId')
      .lean();

    // 添加空值检查
    expect(populatedBooking).toBeDefined();
    expect(populatedBooking.userId).toBeDefined();
    expect(populatedBooking.courtId).toBeDefined();

    expect(populatedBooking.userId.username).toBe('testbookinguser');
    expect(populatedBooking.courtId.name).toBe('Test Booking Court');
  });

  it('should validate date format', async () => {
    const invalidDate = 'not-a-date';
    const timeSlot = new Date('2024-12-01T10:00:00.000Z');

    let error;
    try {
      await Booking.create({
        userId: testUser._id,
        courtId: testCourt._id,
        date: invalidDate,
        timeSlot: timeSlot
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
  });
});