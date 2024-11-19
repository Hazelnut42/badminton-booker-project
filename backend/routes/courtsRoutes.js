const express = require('express');
const Court = require('../models/courts');
const mongoose = require('mongoose');

const router = express.Router();

// 获取所有球场信息（支持分页和搜索）
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    try {
        const query = search
            ? { name: { $regex: search, $options: 'i' } } // 模糊搜索，忽略大小写
            : {};

        const courts = await Court.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Court.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            courts,
        });
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