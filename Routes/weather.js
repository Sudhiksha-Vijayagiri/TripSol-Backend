const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const API_KEY = '468a4c077643285196266d757b961c70';

router.get('/:city', async (req, res) => {
  const city = req.params.city;
  const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    const weather = await response.json();
    if(weather.cod !==200){
      return res.status(404).json({
        success: false,
        message: weather.message || 'City not found'
      });
    }
    res.json({
      success:true,
      data: {
        city: weather.name,
        temperature: `${weather.main.temp}°C`,
        condition: weather.weather[0].description,
        humidity: `${weather.main.humidity}%`,
        wind: `${weather.wind.speed} m/s`
      },
      message: `Weather data for ${city} fetched successfully.`
    });
    
  } catch(err) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch weather information at the moment.',
      details: err.message
    });
  }
});

module.exports = router;
