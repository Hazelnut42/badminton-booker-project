const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 直接引入 mongoose
const authRoutes = require('./routes/authRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const courtsRoutes = require('./routes/courtsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// 硬编码 MongoDB URI
const MONGO_URI = 'mongodb+srv://Hazelchen:Hazelnut0607@cluster0.wht3u.mongodb.net/taskManagerDB?retryWrites=true&w=majority';

// 连接数据库
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};
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