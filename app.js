const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

// Import Routes
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const attractionsRoutes = require("./routes/attractions");
const bookingsRoutes = require("./routes/bookings");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/attractions", attractionsRoutes);
app.use("/bookings", bookingsRoutes);

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("Connected to DB!");
  }
);

// Listen on port 3000
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
