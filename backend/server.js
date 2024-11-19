require('dotenv').config({ path: '../.env' }); // 加载 .env 文件
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courtsRoutes = require('./routes/courtsRoutes'); // 引入 courts 路由
const bookingsRoutes = require('./routes/bookRoutes'); // 如果需要，添加 booking 路由
const connectDB = require('./config/db'); // 数据库连接

const app = express();
const PORT = process.env.PORT || 5001;

// 连接数据库
connectDB();

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 路由
app.use('/api/auth', authRoutes); // 认证相关路由
app.use('/api/courts', courtsRoutes); // 球场相关路由
app.use('/api/bookings', bookingsRoutes); // 如果需要，添加 booking 路由

// 根路由
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});