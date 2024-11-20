require('dotenv').config({ path: '../.env' }); // 加载 .env 文件
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const courtsRoutes = require('./routes/courtsRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const connectDB = require('./config/db'); // 数据库连接
const seedDatabase = require('./seed'); // 引入种子数据脚本

const app = express(); // 初始化 app
const PORT = process.env.PORT || 5001;

// 提供静态图片路径
app.use('/images', express.static(path.join(__dirname, 'images')));

// 连接数据库并初始化种子数据
connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        // 初始化种子数据（如果需要）
        // seedDatabase(); // 根据需要取消注释
    })
    .catch(error => console.error('Error connecting to MongoDB:', error.message));

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/bookings', bookingsRoutes);

// 根路由
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});