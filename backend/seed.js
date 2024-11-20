const mongoose = require('mongoose');
const Court = require('./models/courts');
const connectDB = require('./config/db');

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
        await connectDB();
        console.log('Connected to MongoDB');
        await Court.deleteMany({});
        console.log('Existing courts data cleared');
        await Court.insertMany(courtsData);
        console.log('Inserted seed courts data');
    } catch (error) {
        console.error('Error seeding database:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
};

module.exports = seedDatabase;