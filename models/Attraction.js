const mongoose = require("mongoose");

const attractionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
  opening_time: {
    type: String,
    required: true,
  },
  closing_time: {
    type: String,
    required: true,
  },
  time_slots: {
    type: Array,
    required: true,
    default: [],
  },
  max_customers: {
    type: Number,
    min: 1,
  },
  min_age: {
    type: Number,
    min: 1,
  },
  max_weight: {
    type: Number,
  },
  min_height: {
    type: Number,
  },
  ratings: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Attractions", attractionSchema);
