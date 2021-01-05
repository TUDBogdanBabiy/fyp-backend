const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    surname: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    password: {
        type: String,
        min: 8,
        max: 1024
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    type: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', userSchema);