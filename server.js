const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedToplogy: true,
}).then(() => console.log("DB connected")).catch(err => console.log(err));

app.use('/auth', require('./routers/authRoutes'));

const PORT = process.env.PORT || 500;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));