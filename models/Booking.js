const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
  },
  attraction_id: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  date_booked: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bookings", bookingSchema);
