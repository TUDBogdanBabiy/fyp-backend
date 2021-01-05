const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const User = require('../models/User');
const { registerValidation } = require('../validation');
const bcrypt = require('bcryptjs');

router.get('/', verify, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json({ message: error })
    }
});

router.post('/add', verify, async (req, res) => {
    // Validate the data before creating a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('This email already exists!');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        type: req.body.type,
    });
    try {
        const savedUser = await user.save();
        res.status(200).send('User Added Successfully!');

    } catch (error) {
        res.json({ message: error })
    }
});

module.exports = router;