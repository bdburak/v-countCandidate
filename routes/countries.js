const express = require('express');
const router = express.Router();
const Countries = require('../models/countries');

// Getting all countries
router.get('/', async (req, res) => {
    try {
        const countries = await Countries.find().select('-_id');
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;