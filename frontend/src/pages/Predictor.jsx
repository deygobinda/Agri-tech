import { useState, useEffect } from 'react';
import axios from 'axios';
import * as tmImage from '@teachablemachine/image';
import { URL, BackendURL } from '../config';

function Predictor() {
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState("");
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [treatment, setTreatment] = useState("");
    const [crop, setCrop] = useState("");
    const [isPredicting, setIsPredicting] = useState(false);

    useEffect(() => {
        loadModel();
    }, []);

    const loadModel = async () => {
        try {
            setLoading(true);
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            const model = await tmImage.load(modelURL, metadataURL);
            setModel(model);
        } catch (e) {
            console.error("Error loading model", e);
        } finally {
            setLoading(false);
        }
    };

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
            setIsPredicting(true);
            const response = await axios.post(`${BackendURL}/upload`, formData);
            setImage(response.data.image);
            await predict(response.data.image);
        } catch (error) {
            console.error("Error uploading file", error);
        } finally {
            setIsPredicting(false);
        }
    };

    const predict = async (imageSrc) => {
        if (!model) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = async () => {
            const prediction = await model.predict(img);
            const result = getHighestPrediction(prediction);
            setLabel(result);
            setCrop("Wheat");
            await fetchTreatment(result);
        };
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

    return (
        <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/background.jpg')" }}>
            <div className="w-full max-w-lg lg:max-w-4xl">
                <div className="bg-gray-900 bg-opacity-50 text-white p-6 sm:p-10 shadow-lg rounded-xl w-full">
                    <div className="lg:flex lg:gap-10">
                        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-center text-blue-500 mb-6">Upload Crop Image</h1>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 ${dragActive ? 'border-green-500 bg-green-100 bg-opacity-50' : 'border-gray-700'} border-dashed p-4 sm:p-6 rounded-lg mt-4 text-center transition-colors duration-300 ease-in-out cursor-pointer w-full`}
                            >
                                <p className="text-gray-300 text-sm sm:text-base">{dragActive ? "Release to upload" : "Drag & Drop your image here"}</p>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4 w-full text-center text-sm sm:text-base" />
                            </div>
                            <button
                                onClick={loadModel}
                                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading || !image}
                            >
                                {loading ? 'Loading...' : 'Repredict'}
                            </button>
                        </div>
                        <div className="w-full lg:w-1/2">
                            {image && (
                                <div className="mt-6 lg:mt-0">
                                    <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-lg" />
                                </div>
                            )}
                            {isPredicting && <div className="mt-4 text-gray-300">Analyzing image...</div>}
                            {!isPredicting && label && (
                                <div className="mt-4">
                                    <div className={`text-base sm:text-lg font-medium ${label.includes("Healthy") ? "text-green-500" : "text-red-500"}`}>
                                        Disease: {label}
                                    </div>
                                    {treatment && (
                                        <div className="mt-2 text-base sm:text-lg text-gray-200 font-medium">
                                            Treatment: {treatment}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Predictor;