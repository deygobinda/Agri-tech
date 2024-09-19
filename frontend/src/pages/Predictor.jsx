import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as tmImage from '@teachablemachine/image';
import { URL, BackendURL } from '../config';
import { AlertCircle, Upload, MapPin, RefreshCw, CloudRain, Thermometer, Droplets } from 'lucide-react';

const RAPIDAPI_KEY = "c485dbaecbmsh1cd6794f0c99d09p1efe0ajsn88f766cf5730";

function Predictor() {
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState("");
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [treatment, setTreatment] = useState("");
    const [crop, setCrop] = useState("");
    const [isPredicting, setIsPredicting] = useState(false);
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);

    const loadModel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            const model = await tmImage.load(modelURL, metadataURL);
            setModel(model);
        } catch (e) {
            console.error("Error loading model", e);
            setError("Failed to load the prediction model. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadModel();
    }, [loadModel]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setError(null);
            const response = await axios.post(`${BackendURL}/upload`, formData);
            setImage(response.data.image);
            setStep(2);
        } catch (error) {
            console.error("Error uploading file", error);
            setError("Failed to upload the image. Please try again.");
        }
    };

    const predict = async () => {
        if (!model || !image) return;

        setIsPredicting(true);
        setError(null);
        try {
            const img = new Image();
            img.src = image;
            await img.decode();
            const prediction = await model.predict(img);
            const result = getHighestPrediction(prediction);
            setLabel(result);
            setCrop("Wheat");
            await Promise.all([fetchTreatment(result), fetchWeather()]);
            setStep(3);
        } catch (error) {
            console.error("Error during prediction", error);
            setError("An error occurred during prediction. Please try again.");
        } finally {
            setIsPredicting(false);
        }
    };

    const getHighestPrediction = (prediction) => {
        return prediction.reduce((max, p) => p.probability > max.probability ? p : max).className;
    };

    const fetchTreatment = async (disease) => {
        try {
            const response = await axios.post(`${BackendURL}/treatment`, { disease });
            setTreatment(response.data.Treatement);
        } catch (error) {
            console.error("Error fetching treatment", error);
            setTreatment("Treatment information unavailable");
        }
    };

    const fetchWeather = async () => {
        if (!city) return;

        if (!RAPIDAPI_KEY) {
            setError("RapidAPI key is missing. Please check your environment variables.");
            return;
        }

        try {
            const options = {
                method: 'GET',
                url: 'https://weatherapi-com.p.rapidapi.com/current.json',
                params: { q: city },
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            setWeather(response.data);
        } catch (error) {
            console.error("Detailed error information:", error);
            setError("Failed to fetch weather data. Please try again.");
            setWeather(null);
        }
    };

    const resetState = () => {
        setStep(1);
        setImage(null);
        setCity("");
        setLabel("");
        setTreatment("");
        setWeather(null);
        setError(null);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">Upload Crop Image</h2>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 ${dragActive ? 'border-green-400 bg-green-100 bg-opacity-10' : 'border-gray-600'} border-dashed p-6 rounded-lg text-center transition-colors duration-300 ease-in-out cursor-pointer`}
                        >
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-300">{dragActive ? "Release to upload" : "Drag & Drop your image here"}</p>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
                                Select a file
                            </label>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-blue-400 mb-4">Enter Location</h2>
                        <div className="flex items-center space-x-2">
                            <MapPin className="text-gray-400" />
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter city name"
                                className="flex-grow bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={predict}
                                disabled={!city || isPredicting}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50"
                            >
                                {isPredicting ? <RefreshCw className="animate-spin" /> : 'Predict'}
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">Results</h2>
                        <div className="space-y-4">
                            <div className='flex  justify-between'>
                                <div >
                                    <div>
                                        {image && <img src={image} alt="Uploaded" className="w-2/3 max-w-md mx-auto h-auto rounded-lg shadow-lg" />}
                                        <div className={`text-lg font-medium ${label.includes("Healthy") ? "text-green-400" : "text-red-400"}`}>
                                            Disease: {label}
                                        </div>
                                        {treatment && (
                                            <div className="text-sm text-gray-300">
                                                Treatment: {treatment}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {weather && (
                                        <div className="bg-gray-700 rounded-lg p-4 mt-4">
                                            <h3 className="text-lg font-medium text-blue-300 mb-2">Weather in {city}</h3>
                                            <div className="space-y-2 text-gray-200">
                                                <div className="flex items-center">
                                                    <Thermometer className="mr-2" />
                                                    <span>Temperature: {weather.current.temp_c}°C</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <CloudRain className="mr-2" />
                                                    <span>Condition: {weather.current.condition.text}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Droplets className="mr-2" />
                                                    <span>Humidity: {weather.current.humidity}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={resetState}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 mt-4"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/background.jpg')" }}>
            <div className="w-full max-w-2xl">
                <div className="bg-gray-900 bg-opacity-75 text-white p-6 shadow-lg rounded-xl">
                    {error && (
                        <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}
                    {loading && (
                        <div className="mb-4">
                            <p className="text-center mb-2">Loading model...</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                            </div>
                        </div>
                    )}
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}

export default Predictor;