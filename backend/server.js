require('dotenv').config({ path: '../.env' });
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);

// 模拟球场数据
const courts = [
    {
        id: 1,
        name: "Stage 18 Badminton Centre",
        address: "2351 No 6 Rd #170, Richmond, BC V6V 1P3",
        image: "/images/stage18.jpg",
        coordinates: { lat: 49.194430, lng: -123.081740 }
    },
    {
        id: 2,
        name: "ERSC Epic Racquet Sports Club",
        address: "4551 No. 3 Rd unit 140, Richmond, BC V6X 2C3",
        image: "/images/ersc.jpg",
        coordinates: { lat: 49.185650, lng: -123.136250 }
    },
    {
        id: 3,
        name: "Drive Badminton Centre",
        address: "4551 No 3 Rd #138, Richmond, BC V6X 2C3",
        image: "/images/drive.jpg",
        coordinates: { lat: 49.185910, lng: -123.136560 }
    },
    {
        id: 4,
        name: "ClearOne Badminton Centre",
        address: "2368 No 5 Rd Unit 160, Richmond, BC V6X 2T1",
        image: "/images/clearone.jpg",
        coordinates: { lat: 49.188880, lng: -123.093800 }
    },
    {
        id: 5,
        name: "ClearOne Badminton Centre No 3 Rd",
        address: "4351 No 3 Rd #100, Richmond, BC V6X 3A7",
        image: "/images/clearone3rd.jpg",
        coordinates: { lat: 49.184430, lng: -123.136980 }
    },
    {
        id: 6,
        name: "Badminton Vancouver",
        address: "13100 Mitchell Rd SUITE 110, Richmond, BC V6V 1M8",
        image: "/images/badmintonvancouver.jpg",
        coordinates: { lat: 49.185980, lng: -123.089250 }
    },
    {
        id: 7,
        name: "Ace Badminton",
        address: "9151 Van Horne Way, Richmond, BC V6X 1W2",
        image: "/images/ace.jpg",
        coordinates: { lat: 49.186440, lng: -123.098210 }
    },
    {
        id: 8,
        name: "Wing's Badminton - Richmond Oval",
        address: "6111 River Rd, Richmond, BC V7C 0A2",
        image: "/images/wings.jpg",
        coordinates: { lat: 49.170890, lng: -123.168570 }
    }
];

// 获取所有球场信息
app.get('/api/courts', (req, res) => {
    res.json(courts);
});

// 根据 ID 获取球场详情
app.get('/api/courts/:id', (req, res) => {
    const court = courts.find(c => c.id === parseInt(req.params.id));
    if (!court) return res.status(404).send("Court not found");
    res.json(court);
});

// 根路由
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});