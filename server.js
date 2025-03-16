const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MONGO_URI = "mongodb+srv://kene123e:kene54321e@cluster0.5tt40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB Connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.use('/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));