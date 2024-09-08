const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Add this line
const path = require('path');
const app = express();
const port = 5000;


app.use(cors()); 


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use('/model', express.static(path.join(__dirname, 'models')));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }


  const base64Image = req.file.buffer.toString('base64');
  res.json({ image: `data:image/jpeg;base64,${base64Image}` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
