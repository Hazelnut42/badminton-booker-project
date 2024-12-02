const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

console.log = jest.fn();
console.error = jest.fn();

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('Database Connection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to database successfully', async () => {
    await connectDB();
    
    expect(mongoose.connection.readyState).toBe(1);
    expect(console.log).toHaveBeenCalledWith('MongoDB connected successfully');
  });

  it('should handle connection errors', async () => {
    const originalUri = process.env.MONGO_URI;
    
    process.env.MONGO_URI = 'mongodb://invalid:27017/test';

    await connectDB();

    expect(console.error).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);

    process.env.MONGO_URI = originalUri;
  });

  it('should connect with correct database name', async () => {
    await connectDB();
    
    const dbName = mongoose.connection.name;
    expect(dbName).toBeDefined();
    expect(typeof dbName).toBe('string');
  });

  it('should handle missing MongoDB URI', async () => {
    const originalUri = process.env.MONGO_URI;
    delete process.env.MONGO_URI;

    await connectDB();

    expect(console.error).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);

    process.env.MONGO_URI = originalUri;
  });
});