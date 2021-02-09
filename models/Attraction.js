const mongoose = require("mongoose");

const attractionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    price: {
        type: Number,
        required: true,
    },
    opening_time: {
        type: String,
        required: true
    },
    closing_time: {
        type: String,
        required: true
    },
    time_slots: {
        type: Array,
        default: []
    },
    max_customers: {
        type: Number,
        required: true,
        min: 1,
    },
    min_age: {
        type: Number,
        required: true,
        min: 1,
    },
    max_weight: {
        type: Number,
        required: true
    },
    min_height: {
        type: Number,
        required: true
    },
    ratings: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model('Attractions', attractionSchema);