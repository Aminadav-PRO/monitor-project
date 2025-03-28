const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create an Express server
const app = express();
const port = 4000;

// Enable CORS and configure JSON parsing
app.use(cors());
app.use(express.json());

// Define schema for flight data
const flightDataSchema = new mongoose.Schema({
  altitude: {
    type: Number,
    required: true,
    min: 0,
    max: 3000
  },
  his: {
    type: Number,
    required: true,
    min: 0,
    max: 360
  },
  adi: {
    type: Number,
    required: true,
    min: -100,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create model (MongoDB will create the collection 'flightdatas')
const FlightData = mongoose.model('FlightData', flightDataSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/monitor-flight', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connection to mongoDB successful'))
.catch((error) => console.error('Error connecting to mongoDB:', error));

// POST route to save data
app.post('/data', async (req, res) => {
  const { altitude, his, adi } = req.body;

  try {
    const newFlightData = new FlightData({ altitude, his, adi });
    const savedData = await newFlightData.save();

    console.log('Data saved:');
    console.log('Altitude:', savedData.altitude);
    console.log('HIS:', savedData.his);
    console.log('ADI:', savedData.adi);

    res.status(201).send('Data successfully saved to the database');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// ✅ GET route to return all flight data
app.get('/data', async (req, res) => {
  try {
    const allData = await FlightData.find().sort({ timestamp: -1 }); // Latest first
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving data');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
