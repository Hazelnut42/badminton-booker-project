const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Court = require('../models/courts');
const moment = require('moment');

// create booking
router.post('/book', async (req, res) => {
    const { userId, courtId, date, timeSlot } = req.body;

    try {
        // 将 date 转换为 Date 对象
        const parsedDate = moment(date).local().toDate();  // 例如 "2024-11-19"

        // 解析 timeSlot，假设 timeSlot 是 "8:00-9:00"
        const timeParts = timeSlot.split('-')[0].split(':');  // "8:00" -> ["8", "00"]
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);

        // 创建完整的 timeSlot Date 对象，使用 date 的年月日，设置时和分
        const timeSlotDate = new Date(parsedDate);
        timeSlotDate.setHours(hours, minutes, 0, 0);  // 设置时、分为 8:00 AM

        // 创建新的预定对象
        const newBooking = new Booking({
            userId,
            courtId,
            date: new Date(),  // 存储日期
            timeSlot: timeSlotDate // 存储完整时间
        });

        await newBooking.save();  // 保存到数据库
        const court = await Court.findById(courtId);
        const bookingData = {
            userId,          // 用户ID
            courtId,         // 场地ID
            date: date,  // 当前日期
            timeSlot: timeSlot,  // 预定的时间
            courtName: court.name,  // court 的名字
            // courtCost: court.cost,  // court 的费用
            courtLocation: court.address,  // court 的位置
            // courtContact: court.contact  // court 的联系方式
        };
        res.status(201).json({ message: 'Booking successful', booking: bookingData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating booking', message: err.message });
    }
});




// get booking history
router.get('/history/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate('courtId');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching booking history' });
    }
});

// cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking || booking.status === 'cancelled') {
            return res.status(404).json({ error: 'Booking not found or already cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled', booking });
    } catch (err) {
        res.status(500).json({ error: 'Error cancelling booking' });
    }
});


router.get('/availability', async (req, res) => {
    const { courtId, date } = req.query;  // 获取请求中的 courtId 和 date 参数

    // 如果没有提供 date，则使用今天的日期
    const targetDate = date ? moment(date).startOf('day') : moment().startOf('day');

    // 计算未来六天的时间表
    const availability = [];
    for (let i = 0; i < 7; i++) {
        // 对每一天的时间段进行遍历
        const currentDate = targetDate.clone().add(i, 'days');

        // 收集每天所有的时间段（8点到22点）
        const timeSlots = [];
        for (let hour = 8; hour < 22; hour++) {
            const timeSlot = currentDate.clone().set('hour', hour).set('minute', 0).toDate();
            timeSlots.push(timeSlot);
        }

        // 查找该 courtId 在未来 7 天中的所有已确认的预定
        const bookedSlots = await Booking.find({
            courtId,
            timeSlot: { $in: timeSlots },
            status: 'confirmed'  // 只查找已确认的预定
        });

        // 构建该日期的可用性
        timeSlots.forEach((slot) => {
            const slotHour = slot.getHours();  // 获取小时部分
            const isBooked = bookedSlots.some((booking) => {
                // 如果该预定的 timeSlot 和当前的 slot 匹配，则认为这个时段已被预定
                return moment(booking.timeSlot).isSame(slot, 'hour');
            });

            availability.push({
                date: currentDate.format('YYYY-MM-DD'),
                time: slotHour,
                isAvailable: !isBooked,  // 如果没有预定，则为可用
            });
        });
    }

    // 返回所有时段的可用性
    res.json({ availableSlots: availability });
});
module.exports = router;
