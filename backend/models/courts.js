const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Court', courtSchema);