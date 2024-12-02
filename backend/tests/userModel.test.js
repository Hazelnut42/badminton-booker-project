const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

jest.setTimeout(30000);

describe('User Model', () => {
  beforeAll(async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      });
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a valid user', async () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User'
    };

    const savedUser = await User.create(validUser);
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.displayName).toBe(validUser.displayName);
  });

  it('should fail without required fields', async () => {
    const invalidUser = new User({});
    
    let error;
    try {
      await invalidUser.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should set default displayName to username if not provided', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(user.displayName).toBe(user.username);
  });

  it('should enforce unique username', async () => {
    const firstUser = {
      username: 'testuser',
      email: 'test1@example.com',
      password: 'password123'
    };

    await User.create(firstUser);

    let error;
    try {
      await User.create({
        ...firstUser,
        email: 'test2@example.com'
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  it('should enforce unique email', async () => {
    const firstUser = {
      username: 'testuser1',
      email: 'test@example.com',
      password: 'password123'
    };

    await User.create(firstUser);

    let error;
    try {
      await User.create({
        ...firstUser,
        username: 'testuser2'
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  it('should validate bio length', async () => {
    let error;
    try {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'a'.repeat(501) // Bio longer than 500 characters
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.bio).toBeDefined();
  });

  it('should prevent username modification after creation', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    user.username = 'newusername';
    
    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    const unchangedUser = await User.findById(user._id);
    expect(unchangedUser.username).toBe('testuser');
  });

  it('should include timestamps', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});