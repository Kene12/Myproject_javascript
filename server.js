const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MONGO_URI = "mongodb+srv://kene123e:kene54321e@cluster0.5tt40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB Connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.use('/auth', require('./routes/authRoutes'));
app.use('/manage', require('./routes/manageRoutes'));
app.use('/userManage', require('./routes/userManage'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));