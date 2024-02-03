const express = require('express');
const router = express.Router();
const Countries = require('../models/countries');

// Getting all countries
router.get('/', async (req, res) => {
    try {
        // Returns null if request query has no region parameter. This lets us accept both an empty request and a query parameter request
        let searchQuery = req.query.region? { region: req.query.region } : null;
        const countries = await Countries.find(searchQuery).select('-_id');
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;