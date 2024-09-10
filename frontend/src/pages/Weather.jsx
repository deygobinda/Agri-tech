import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/recommend', { city });
      setCrops(response.data);
    } catch (error) {
      //console.error('Error fetching crop recommendations', error);
      setError('Failed to fetch crop recommendations');
    }
  };

  return (
    <div className='flex flex-col items-center min-h-screen bg-cover bg-center py-10 bg-black'>
      <div className="max-w-lg mx-auto bg-black shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-blue-600">Crop Recommendation System</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Get Recommendations
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <h2 className="text-xl font-semibold mt-6 text-white">Recommended Crops:</h2>
        <ul className="list-disc list-inside space-y-2 mt-4">
          {crops.map((crop) => (
            <li key={crop.id} className="text-white">{crop.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Weather;
