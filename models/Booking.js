const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  attraction_id: {
    type: String,
    required: true,
  },
  attraction_name: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  date_booked: {
    type: Date,
    default: Date,
  },
});

module.exports = mongoose.model("Bookings", bookingSchema);
