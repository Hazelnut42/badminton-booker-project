const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Court = require('../models/courts');

let mongoServer;

describe('Court Model Tests', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('should create and save a court successfully', async () => {
        const validCourt = new Court({
            name: 'Test Court',
            address: '123 Test Street',
            image: '/images/test.jpg',
            coordinates: {
                lat: 49.12345,
                lng: -123.12345,
            },
        });

        const savedCourt = await validCourt.save();

        expect(savedCourt._id).toBeDefined();
        expect(savedCourt.name).toBe('Test Court');
        expect(savedCourt.address).toBe('123 Test Street');
        expect(savedCourt.image).toBe('/images/test.jpg');
        expect(savedCourt.coordinates.lat).toBe(49.12345);
        expect(savedCourt.coordinates.lng).toBe(-123.12345);
    });

    test('should not save court without required fields', async () => {
        const invalidCourt = new Court({
            address: '123 Test Street',
        });

        let err;
        try {
            await invalidCourt.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
        expect(err.errors.image).toBeDefined();
        expect(err.errors['coordinates.lat']).toBeDefined();
        expect(err.errors['coordinates.lng']).toBeDefined();
    });

    test('should retrieve a court from the database', async () => {
        const court = new Court({
            name: 'Another Test Court',
            address: '456 Another Street',
            image: '/images/another.jpg',
            coordinates: {
                lat: 50.12345,
                lng: -124.12345,
            },
        });

        await court.save();

        const foundCourt = await Court.findOne({ name: 'Another Test Court' });

        expect(foundCourt).toBeDefined();
        expect(foundCourt.name).toBe('Another Test Court');
        expect(foundCourt.address).toBe('456 Another Street');
        expect(foundCourt.coordinates.lat).toBe(50.12345);
        expect(foundCourt.coordinates.lng).toBe(-124.12345);
    });
});