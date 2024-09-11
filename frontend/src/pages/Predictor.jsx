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
    const [treatment, setTreatment] = useState(""); // State to store treatment information
    const [crop, setCrop] = useState(""); // State to store crop name

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
            setLoading(false);
        } catch (e) {
            setLoading(false);
            //console.error("Error loading model", error);
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
            const response = await axios.post(`${BackendURL}/upload`, formData);
            setImage(response.data.image);
            await predict(response.data.image);
        } catch (error) {
            //console.error("Error uploading file", error);
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

            // Assuming crop information is set in the UI or can be derived
            // For this example, I am manually setting the crop value
            setCrop("Wheat"); // Replace with actual crop data

            // Fetch treatment based on the crop and predicted disease
            await fetchTreatment(result);
        };
    };

    const getHighestPrediction = (prediction) => {
        let highestProb = 0;
        let highestClass = '';

        for (const pred of prediction) {
            if (pred.probability > highestProb) {
                highestProb = pred.probability;
                highestClass = pred.className;
            }
        }

        return highestClass; // Returning just the class name for prediction
    };

    const fetchTreatment = async (disease) => {
        try {
            const response = await axios.post(`${BackendURL}/treatment`, {
                disease
            });

            setTreatment(response.data.Treatement);
        } catch (error) {
            console.error("Error fetching treatment", error);
            setTreatment("Treatment will be coming soon");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-10 bg-black">
            <div>
                <div className='bg-black text-white p-10 shadow-lg rounded-xl w-full max-w-lg flex gap-20'>
                    <div className=' min-w-96'>
                        <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">Upload Crop Image</h1>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 ${dragActive ? 'border-green-500 bg-green-100' : 'border-gray-300'} border-dashed p-6 rounded-lg mt-4 text-center transition-colors duration-300 ease-in-out cursor-pointer w-full`}
                        >
                            <p className="text-white">{dragActive ? "Release to upload" : "Drag & Drop your image here"}</p>
                            <input type="file" accept="image/*"  onChange={handleFileChange} className="mt-4 w-full text-center" />
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center mt-8">
                                <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                                </svg>
                            </div>
                        ) : (
                            <button
                                onClick={loadModel}
                                className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Repredict
                            </button>
                        )}
                    </div>

                    <div className=' min-w-96'>
                        {image && (
                            <div className="mt-8">
                                <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-lg" />
                            </div>
                        )}

                        {!label && !treatment && <div  className='mt-6'>Loading...</div>}

                        <div>
                            {label && (
                                <div className="mt-6 text-lg  text-white font-medium">
                                    Disease: {label}
                                </div>
                            )}

                            {treatment && (
                                <div className="mt-4 text-lg  text-white font-medium">
                                    Treatment: {treatment}
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
