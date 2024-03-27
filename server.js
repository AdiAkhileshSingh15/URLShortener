const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
require('dotenv').config();

const app = express();

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());

app.use('/api/url', require('./routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
