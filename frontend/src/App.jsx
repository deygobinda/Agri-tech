import React, { useState } from 'react';
import axios from 'axios';
import * as tmImage from '@teachablemachine/image';

const URL = "http://localhost:5000/model/";

function App() {
  const [image, setImage] = useState(null);
  const [label, setLabel] = useState("");
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/upload', formData);
      setImage(response.data.image);
      await predict(response.data.image);
    }
  };

  const loadModel = async () => {
    try {
      setLoading(true);
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      const model = await tmImage.load(modelURL, metadataURL);
      setModel(model);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error loading model", error);
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

    return `Most likely class: ${highestClass} with probability ${highestProb.toFixed(2)}`;
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Image Model</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading ? <p>Loading model...</p> : <button onClick={loadModel}>Load Model</button>}
      {image && <img src={image} alt="Uploaded" style={{ marginTop: "20px", maxWidth: "500px" }} />}
      {label && <div style={{ marginTop: "20px", fontSize: "20px" }}>{label}</div>}
    </div>
  );
}

export default App;
