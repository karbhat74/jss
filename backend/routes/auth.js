const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Admin Default Credentials (Hardcoded)
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

// User Registration
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// User/Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if admin
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const token = jwt.sign({ username, role: 'admin' }, 'secretkey');
        return res.json({ token, role: 'admin' });
    }

    // Check for normal users
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey');
    res.json({ token, role: user.role });
});

module.exports = router;
