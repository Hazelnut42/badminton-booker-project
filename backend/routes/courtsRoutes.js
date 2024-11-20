const express = require('express');
const Court = require('../models/courts');
const mongoose = require('mongoose');

const router = express.Router();

// Get all court information
router.get('/', async (req, res) => {
    try {
        const courts = await Court.find(); // Fetch the list of courts from the database
        console.log('Courts fetched from DB:', courts); // Debug log
        res.json(courts);
    } catch (error) {
        console.error('Error fetching courts:', error.message);
        res.status(500).json({ message: 'Error fetching courts' });
    }
});

// Get court details by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ID format
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