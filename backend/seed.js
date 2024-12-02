const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log('Starting seed script...');
console.log('MongoDB URI:', process.env.MONGO_URI ? 'Found' : 'Not found');

const mongoose = require('mongoose');
const Court = require('./models/courts');

const courtsData = [
    {
        name: "Stage 18 Badminton Centre",
        address: "2351 No 6 Rd #170, Richmond, BC V6V 1P3",
        image: "/images/stage18.jpg",
        coordinates: { lat: 49.194430, lng: -123.081740 }
    },
    {
        name: "ERSC Epic Racquet Sports Club",
        address: "4551 No. 3 Rd unit 140, Richmond, BC V6X 2C3",
        image: "/images/ersc.jpg",
        coordinates: { lat: 49.185650, lng: -123.136250 }
    },
    {
        name: "Drive Badminton Centre",
        address: "4551 No 3 Rd #138, Richmond, BC V6X 2C3",
        image: "/images/drive.jpg",
        coordinates: { lat: 49.185910, lng: -123.136560 }
    },
    {
        name: "ClearOne Badminton Centre",
        address: "2368 No 5 Rd Unit 160, Richmond, BC V6X 2T1",
        image: "/images/clearone.jpg",
        coordinates: { lat: 49.188880, lng: -123.093800 }
    },
    {
        name: "ClearOne Badminton Centre No 3 Rd",
        address: "4351 No 3 Rd #100, Richmond, BC V6X 3A7",
        image: "/images/clearone3rd.jpg",
        coordinates: { lat: 49.184430, lng: -123.136980 }
    },
    {
        name: "Badminton Vancouver",
        address: "13100 Mitchell Rd SUITE 110, Richmond, BC V6V 1M8",
        image: "/images/badmintonvancouver.jpg",
        coordinates: { lat: 49.185980, lng: -123.089250 }
    },
    {
        name: "Ace Badminton",
        address: "9151 Van Horne Way, Richmond, BC V6X 1W2",
        image: "/images/ace.jpg",
        coordinates: { lat: 49.186440, lng: -123.098210 }
    },
    {
        name: "Wing's Badminton - Richmond Oval",
        address: "6111 River Rd, Richmond, BC V7C 0A2",
        image: "/images/wings.jpg",
        coordinates: { lat: 49.170890, lng: -123.168570 }
    }
];

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');

        console.log('Checking existing courts...');
        const existingCourts = await Court.find({});
        console.log(`Found ${existingCourts.length} existing courts`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const court of courtsData) {
            const existingCourt = await Court.findOne({ name: court.name });
            if (!existingCourt) {
                await Court.create(court);
                console.log(`Added new court: ${court.name}`);
                addedCount++;
            } else {
                console.log(`Skipped existing court: ${court.name}`);
                skippedCount++;
            }
        }

        console.log('\nSeed Results:');
        console.log(`Added courts: ${addedCount}`);
        console.log(`Skipped courts: ${skippedCount}`);
        
        // Final verification
        const finalCourts = await Court.find({});
        console.log(`Total courts in database: ${finalCourts.length}`);
    } catch (error) {
        console.error('Error in seed process:', error);
    }
};

// Execute the seed function
console.log('Initiating database seed process...');
seedDatabase()
    .then(() => {
        console.log('Seed script completed successfully');
    })
    .catch(error => {
        console.error('Seed script failed:', error);
    });