const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const { bookingValidation } = require("../validation");
const verifyToken = require("./verifyToken");

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

router.delete("/delete/:booking_id", verifyToken, async (req, res) => {
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

router.patch("/update/:booking_id", verifyToken, async (req, res) => {
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

router.post("/add", verifyToken, async (req, res) => {
  // Validate the data before creating a user
  const { error } = bookingValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the attraction exists
  const bookingExists = await Booking.findOne({
    attraction_id: req.body.attraction_id,
    start_time: req.body.start_time,
  });
  if (bookingExists)
    return res.status(400).send("This attraction already exists!");

  const { customer_id, attraction_id, start_time } = req.body;

  const booking = new Booking({
    customer_id: customer_id,
    attraction_id: attraction_id,
    start_time: start_time,
  });
  try {
    const savedBooking = await booking.save();
    res.status(200).send("Booking Added Successfully!");
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
