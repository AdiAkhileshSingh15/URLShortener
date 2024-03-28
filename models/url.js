const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    requiresLogin: {
        type: Boolean,
        default: false
    },
    expirationDate: {
        type: Date
    },
    createdBy: {
        type: String
    }
});

module.exports = mongoose.model('Url', UrlSchema);
