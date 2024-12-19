const express = require('express');
const Event = require('../models/Event');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Create Event (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { name, date, fee, image } = req.body;

    const event = new Event({ name, date, fee, image });
    try {
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get All Events
router.get('/', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

// Update Event
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Event
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
