const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require("dotenv");

dotenv.config();

const passportConfig = require('./utils/passport');

const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');


const app = express();

// Setup middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// Setup session and passport
passportConfig(app);

// Setup routes
app.use('/auth', authRoutes);
app.use('/url', urlRoutes);

const PORT = process.env.PORT || 5000;

// Configure MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error: ', err));
