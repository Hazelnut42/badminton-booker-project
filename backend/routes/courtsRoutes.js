const express = require('express');
const Court = require('../models/courts');
const mongoose = require('mongoose');

const router = express.Router();

// 获取所有球场信息
router.get('/', async (req, res) => {
    try {
        const courts = await Court.find(); // 从数据库中获取球场列表
        console.log('Courts fetched from DB:', courts); // 调试日志
        res.json(courts);
    } catch (error) {
        console.error('Error fetching courts:', error.message);
        res.status(500).json({ message: 'Error fetching courts' });
    }
});

// 根据 ID 获取球场详情
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // 验证 ID 格式
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid court ID' });
    }

    try {
        const court = await Court.findById(id);

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        res.json(court);
    } catch (error) {
        console.error('Error fetching court details:', error.message);
        res.status(500).json({ message: 'Error fetching court details' });
    }
});

module.exports = router;