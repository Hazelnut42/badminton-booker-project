require('dotenv').config({ path: '../.env' });
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const courtsRoutes = require('./routes/courtsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// 连接数据库
connectDB();

app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/courts', courtsRoutes);

// 根路由
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});