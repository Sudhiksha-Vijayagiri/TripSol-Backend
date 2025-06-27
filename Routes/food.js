const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const API_KEY = 'fsq3eXGJ0hU4ZQfdXa9LMg09xhEY2tmQuTbjR6mC8NEZuaw=';

router.get('/:city', async (req, res) => {
  const city = req.params.city;
  const url = `https://api.foursquare.com/v3/places/search?query=food&near=${city}&limit=5`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': API_KEY
      }
    });

    if (response.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Foursquare API error: ${response.statusText}`
      });
    }

    const food = await response.json();

    if (!food.results || food.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No food places found for the given city.'
      });
    }

    res.json({
      success: true,
      data: food.results.map(place => ({
        name: place.name,
        address: place.location?.formatted_address ||
          `${place.location?.address || ''}, ${place.location?.locality || ''}`.trim() ||
          'Address not found',
        category: place.categories?.[0]?.name || 'N/A'
      })),
      message: `Food places in ${city} fetched successfully.`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch food places at the moment.',
      details: err.message
    });
  }
});

module.exports = router;
