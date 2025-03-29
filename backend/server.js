const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config'); // Import config file

// Create an Express server
const app = express();

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
  }
});

// Create model
const FlightData = mongoose.model(config.MONGO_COLLECTION, flightDataSchema);

// Connect to MongoDB
mongoose.connect(`mongodb://${config.MONGO_URL}/${config.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('Connection to MongoDB successful'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// POST route to save data
app.post('/data', async (req, res) => {
  const { altitude, his, adi } = req.body;

  try {
    const newFlightData = new FlightData({ altitude, his, adi });
    await newFlightData.save();
    res.status(201).send('Data successfully saved to the database');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
