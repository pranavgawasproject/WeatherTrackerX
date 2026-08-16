import React, { useState, useEffect } from 'react';
import displayWeather from './js/displayWeather';
import displayHourlyForecast from './js/displayHourlyForecast';

function Weather({ city }) {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);

  useEffect(() => {
    const apiKey = ''; // Replace with your actual API key
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    const fetchWeatherData = async () => {
      try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        setWeatherData(currentWeatherData);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        setHourlyForecast(forecastData.list);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
      }
    };

    fetchWeatherData();
  }, [city]);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        {weatherData ? (
          <>
            <div id="temp-div">
              <p>
                {Math.round(weatherData.main.temp - 273.15)}°C
              </p>
            </div>
            <div id="weather-info">
              <p>{weatherData.name}</p>
              <p>{weatherData.weather[0].description}</p>
            </div>
            <img
              id="weather-icon"
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt={weatherData.weather[0].description}
            />
            <div id="hourly-forecast">
              {displayHourlyForecast(hourlyForecast)}
            </div>
          </>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

export default Weather;