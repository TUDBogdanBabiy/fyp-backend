const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Import Routes
const usersRoute = require('./routes/users');

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes 
app.use('/users', usersRoute);

app.get('/', (req, res) => {
    res.send('We are on home!');
});

// Connect to DB
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })

// Listen on port 3000
app.listen(3000, () => {
    console.log('Server is running');
})