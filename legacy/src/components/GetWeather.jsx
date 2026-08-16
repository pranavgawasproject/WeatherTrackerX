import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getWeather from './js/getWeather';

function GetWeather() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim()) {
      getWeather(city); // Pass the city value from the component's state
      navigate('/weather');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <input
            type="text"
            placeholder="Enter City"
            className="input input-bordered w-full max-w-xs"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-outline" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetWeather;