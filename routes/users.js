const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json({ message: error })
    }
});

router.get('/:userId', (req, res) => {
    console.log(req.params.userId);
});

router.post('/', async (req, res) => {

    try {
        const user = new User({
            name: req.body.name
        });

        const savedUser = await user.save();
        res.json(savedUser);

    } catch (error) {
        res.json({ message: error })
    }
    res.send('Showing all users');
});

module.exports = router;