const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

// Import Routes
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Routes 
app.use('/users', usersRoute);
app.use('/auth', authRoute);

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => { console.log('Connected to DB!'); })

// Listen on port 3000
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})