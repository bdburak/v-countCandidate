const express = require('express');
const axios = require('axios'); // You'll need to install axios to make HTTP requests
const router = express.Router();

// Assuming you have an endpoint to get all countries
const COUNTRIES_ENDPOINT = 'http://localhost:3000/countries';

// Helper function to fetch countries
async function fetchCountries() {
    try {
        const response = await axios.get(COUNTRIES_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching countries:', error);
        throw error;
    }
}

// Helper function to assign countries to reps
function assignCountriesToReps(countries) {
    // Group countries by region
    const regions = countries.reduce((acc, country) => {
        acc[country.region] = acc[country.region] || [];
        acc[country.region].push(country.name);
        return acc;
    }, {});

    // Assign countries to reps
    const assignments = {};
    for (const region in regions) {
        const countryList = regions[region];
        let repIndex = 0;
        let repCount = {}; // Keeps track of how many countries each rep has in the current region

        // Initialize repCount for the region based on the number of countries and the min requirement
        const repsNeeded = Math.ceil(countryList.length / 3);
        for (let i = 0; i < repsNeeded; i++) {
            repCount[`rep${i}`] = 0;
        }

        // Assign countries to reps ensuring the min and max constraints
        countryList.forEach((country, index) => {
            // Find the next rep that has not reached the max limit of 7 countries
            while (repCount[`rep${repIndex}`] >= 7) {
                repIndex++;
            }

            // Assign the country to the current rep
            const rep = `rep${repIndex}`;
            repCount[rep] = (repCount[rep] || 0) + 1;

            // If the current rep has reached 3 countries, move to the next rep
            if (repCount[rep] === 3 && index < countryList.length - 1) {
                repIndex++;
            }

            // Store the assignment
            if (!assignments[region]) {
                assignments[region] = [];
            }
            assignments[region].push({ country, rep });
        });
    }

    return assignments;
}


// Helper function to calculate rep requirements
function calculateRepRequirements(assignments) {
    const requirements = [];
    for (const region in assignments) {
        const reps = assignments[region].reduce((acc, assignment) => {
            acc[assignment.rep] = (acc[assignment.rep] || 0) + 1;
            return acc;
        }, {});

        const repCounts = Object.values(reps);
        const minSalesReq = Math.min(...repCounts);
        const maxSalesReq = Math.max(...repCounts);

        requirements.push({ region, minSalesReq, maxSalesReq });
    }
    return requirements;
}

// Endpoint to get sales representative requirements
router.get('/', async (req, res) => {
    try {
        const countries = await fetchCountries();
        const assignments = assignCountriesToReps(countries);
        const requirements = calculateRepRequirements(assignments);
        res.json(requirements);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;