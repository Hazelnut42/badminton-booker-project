const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
        type: Date, // 使用 Date 类型来存储日期和时间
        required: true
    },
    timeSlot: {
        type: Date, // timeSlot 存储为字符串，记录小时的具体时间
        required: true
    },
    status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled'] },
});

module.exports = mongoose.model('Booking', BookingSchema);
