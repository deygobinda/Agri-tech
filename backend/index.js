const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(
  cors({
    origin: true,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/model", express.static(path.join(__dirname, "models")));
app.use(express.json());

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const base64Image = req.file.buffer.toString("base64");
  res.json({ image: `data:image/jpeg;base64,${base64Image}` });
});

app.post("/recommend", async (req, res) => {
  const { city } = req.body;

  try {
    // Fetch weather data from RapidAPI
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
      params: { q: city, days: 1 },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, 
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    const weatherResponse = await axios.request(options);

    const currentWeather = weatherResponse.data.current;
    const temperature = currentWeather.temp_c; 
    const precipitation = currentWeather.precip_mm || 0; 

    console.log("Weather Data:", { temperature, precipitation }); 
    
    const crops = await prisma.crop.findMany({
      where: {
        AND: [
          { minTemp: { lte: temperature } },
          { maxTemp: { gte: temperature } },
          { minRainfall: { lte: precipitation } },
          { maxRainfall: { gte: precipitation } },
        ],
      },
    });

    res.json(crops);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Server error");
  }
});

app.post("/insert", async (req, res) => {
  await prisma.crop.createMany({
    data: [
      {
        name: "Tomato",
        minTemp: 0,
        maxTemp: 100,
        minRainfall: 0,
        maxRainfall: 500,
      },
      {
        name: "Patato",
        minTemp: 0,
        maxTemp: 100,
        minRainfall: 0,
        maxRainfall: 400,
      },
    ],
  });
  const crops = await prisma.crop.findMany();
  console.log(crops);
  res.json(crops);
});

app.post("/treatment", async (req , res)=>{
    try{
        const body = req.body
    console.log(body.disease)
    const crop = await prisma.treatment.findFirst({
        where:{
            Crop : body.crop,
            Disease : body.disease
        }
    })
    console.log(crop)
    res.json({
        Treatement : crop.Treatment
        
    })
    }catch(e){
        res.json({
            Treatement : "Treatement will be comming soon"
        })
    }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
