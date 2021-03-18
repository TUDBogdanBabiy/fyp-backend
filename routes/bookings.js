const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const User = require("../models/User");
const Attraction = require("../models/Attraction");
const { bookingValidation } = require("../validation");
const verifyToken = require("./verifyToken");

function isExpired({ end_time, date_booked }) {
  // Parse the string date_booked into a new Date
  date_booked = new Date(date_booked);
  // Convert the date date_booked to a date string that excludes time
  let date_booked_string = date_booked.toDateString();
  // Parse the string back to date, the time will be 00:00:00
  date_booked = new Date(date_booked_string);

  let today = new Date();
  let today_string = today.toDateString();
  today = new Date(today_string);

  let expired = false;

  if (today > date_booked) expired = true;
  return expired;
}

router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/customer/:customer_id", verifyToken, async (req, res) => {
  const id = req.params.customer_id;
  try {
    const bookings = await Booking.find({ customer_id: id });
    res.json(bookings);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/attraction/:attraction_id", verifyToken, async (req, res) => {
  const id = req.params.attraction_id;
  try {
    const bookings = await Booking.find({ attraction_id: id });
    res.json(bookings);
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/:booking_id", verifyToken, async (req, res) => {
  const id = req.params.booking_id;
  try {
    const booking = await Booking.findByIdAndDelete(id, {
      useFindAndModify: false,
    });
    if (booking) {
      res.status(200).send("Booking Deleted Successfully!");
    } else {
      res.status(404).send("Booking Not Found!");
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.patch("/:booking_id", verifyToken, async (req, res) => {
  const id = req.params.booking_id;
  try {
    const booking = await Booking.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (booking) {
      res.status(200).send("Booking Updated Successfully!");
    } else {
      res.status(404).send("Booking Not Found!");
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", verifyToken, async (req, res) => {
  // Validate the data before creating a user
  const { error } = bookingValidation(req.body);
  let bookingAlreadyExists = false;
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the attraction exists
  const existingBookings = await Booking.find({
    attraction_id: req.body.attraction_id,
    customer_id: req.body.customer_id,
    start_time: req.body.start_time,
  });

  existingBookings.forEach((booking) => {
    if (!isExpired(booking)) {
      bookingAlreadyExists = true;
    }
  });
  if (bookingAlreadyExists)
    return res.status(400).send("This booking already exists!");

  const { customer_id, attraction_id, start_time, end_time } = req.body;

  let attraction = await Attraction.find({ _id: attraction_id });
  let customer = await User.find({ _id: customer_id });

  const booking = new Booking({
    customer_id: customer_id,
    customer_name: customer[0].firstname,
    attraction_id: attraction_id,
    attraction_name: attraction[0].title,
    start_time: start_time,
    end_time: end_time,
  });
  try {
    const savedBooking = await booking.save();
    res.status(200).send("Booking Added Successfully!");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
