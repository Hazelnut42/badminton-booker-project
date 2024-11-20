import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';

function BookingPage() {
    const { courtId } = useParams();  // courtId 会是 URL 中的动态参数
    console.log(courtId);  // 打印 courtId，确保值正确
    const [slots, setSlots] = useState([]);
    const [date, setDate] = useState('');
    const [dates, setDates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        setUserId(id);
        const today = new Date();
        
        const formattedDate = moment(today).format('YYYY-MM-DD'); // 格式化日期为 yyyy-mm-dd
        setDate(formattedDate);  // 设置当前日期
        // 计算未来六天的日期
        const upcomingDates = [];
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            upcomingDates.push(moment(futureDate).format('YYYY-MM-DD'));
        }
        setDates(upcomingDates);
        console.log(upcomingDates);
    }, []);

    useEffect(() => {
        async function fetchAvailability() {
        
        
        const res = await axios.get(`http://localhost:5001/api/bookings/availability`, { params: { courtId } });
        setSlots(res.data.availableSlots);
        }
        fetchAvailability();
    }, [courtId]);

    const groupedSlots = slots.reduce((acc, slot) => {
        const slotDate = slot.date; // 假设日期字段是 'date'
        if (!acc[slotDate]) {
            acc[slotDate] = [];
        }
        acc[slotDate].push(slot);
        return acc;
    }, {});

    const handleBooking = async () => {
        if (!selectedSlot) return alert('Please select a time slot');  // 如果没有选择任何时间段，提示用户
        if (!userId) return alert('User not logged in');
        const { date, time, isAvailable } = selectedSlot;
        if (!isAvailable) {
            return alert('This time slot is already booked');
        }
        const timeSlot = new Date(date); 
        try {
            
            const response = await axios.post('http://localhost:5001/api/bookings/book', {
                userId, // 替换为真实的用户ID
                courtId,
                date: selectedSlot.date,  // 传递日期字符串 "2024-11-19"
                timeSlot: `${selectedSlot.time}:00-${selectedSlot.time + 1}:00`,
            });

            setSlots((prevSlots) =>
                prevSlots.map((s) =>
                    s.date === selectedSlot.date && s.time === selectedSlot.time
                        ? { ...s, isAvailable: false }
                        : s
                )
            );
            navigate('/confirmation', { state: { booking: response.data.booking } });
        } catch (error) {
            alert('Booking failed');
        }
    };

    return (
        <div className="booking-page-container">
            <h2>Book a Slot</h2>
            <label>Date: </label>
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                disabled // 禁用日期选择器，确保不能修改
            />

            {/* 使用表格展示每一天的时段 */}
            <table className="slots-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        {/* 每个小时之间显示时间段 */}
                        {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((hour) => (
                            <th key={hour}>{`${hour}:00-${hour + 1}:00`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dates.map((day) => (
                        <tr key={day}>
                            <td>{day}</td>
                            {/* 每个日期的时间段显示 */}
                            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((hour) => {
                                const slot = slots.find(slot => slot.date === day && slot.time === hour);
                                    return (
                                        <td key={hour}>
                                        {slot ? (
                                            slot.isAvailable ? (
                                                <button
                                                    style={{
                                                        backgroundColor: selectedSlot && selectedSlot.time === hour && selectedSlot.date === day ? 'purple' : 'green',  // 如果选中了该时段，则变成紫色
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => setSelectedSlot(slot)}  // 选择该 slot
                                                >
                                                    {selectedSlot && selectedSlot.time === hour && selectedSlot.date === day ? 'Selected' : 'Available'}
                                                </button>
                                            ) : (
                                                <button
                                                    style={{
                                                        backgroundColor: 'gray',
                                                        color: 'white',
                                                        cursor: 'not-allowed',
                                                    }}
                                                    disabled
                                                >
                                                    Not Available
                                                </button>
                                            )
                                        ) : (
                                            'Loading...'
                                        )}
                                    </td>
                                    );
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                onClick={handleBooking}
                style={{
                    marginTop: '20px',
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '10px 20px',
                    cursor: 'pointer'
                }}
            >
                Book Now
            </button>
            {/* 加载状态 */}
            {/* {isLoading && <p>Loading...</p>} */}
        </div>
    );
}


export default BookingPage;
