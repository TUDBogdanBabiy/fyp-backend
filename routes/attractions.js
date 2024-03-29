const express = require("express");
const router = express.Router();

const Attraction = require("../models/Attraction");
const { attractionValidation } = require("../validation");
const verifyToken = require("./verifyToken");

router.get("/", verifyToken, async (req, res) => {
  try {
    const attractions = await Attraction.find();
    res.json(attractions);
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/delete/:attraction_id", verifyToken, async (req, res) => {
  const id = req.params.attraction_id;
  try {
    const attraction = await Attraction.findByIdAndDelete(id, {
      useFindAndModify: false,
    });
    if (attraction) {
      res.status(200).send("Attraction Deleted Successfully!");
    } else {
      res.status(404).send("Attraction Not Found!");
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.patch("/update/:attraction_id", verifyToken, async (req, res) => {
  const id = req.params.attraction_id;
  try {
    const attraction = await Attraction.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (attraction) {
      res.status(200).send("Attraction Updated Successfully!");
    } else {
      res.status(404).send("Attraction Not Found!");
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  // Validate the data before creating a user
  const { error } = attractionValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the attraction exists
  const titleExists = await Attraction.findOne({ title: req.body.title });
  if (titleExists)
    return res.status(400).send("This attraction already exists!");

  const {
    title,
    description,
    price,
    opening_time,
    closing_time,
    max_customers,
    min_age,
    max_weight,
    min_height,
    time_slots,
  } = req.body;

  const attraction = new Attraction({
    title: title,
    description: description,
    price: price,
    opening_time: opening_time,
    closing_time: closing_time,
    max_customers: max_customers,
    min_age: min_age,
    max_weight: max_weight,
    min_height: min_height,
    time_slots: time_slots,
  });
  try {
    const savedAttraction = await attraction.save();
    res.status(200).send("Attraction Added Successfully!");
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
