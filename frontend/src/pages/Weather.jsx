import React, { useState } from 'react';
import axios from 'axios';
import { BackendURL } from '../config';

const Weather = () => {
  const [city, setCity] = useState('');
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(`${BackendURL}/recommend`, { city });
      setCrops(response.data);
    } catch (error) {
      setError('Failed to fetch crop recommendations');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-6 sm:py-10 bg-black px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-gray-900 shadow-md rounded-lg p-4 sm:p-6 mt-4 sm:mt-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-blue-500">Crop Recommendation System</h1>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
          >
            Get Recommendations
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-3 sm:mt-4 text-sm sm:text-base">{error}</p>}
        {crops.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Recommended Crops:</h2>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 mt-2 sm:mt-4">
              {crops.map((crop) => (
                <li key={crop.id} className="text-gray-300 text-sm sm:text-base">{crop.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;