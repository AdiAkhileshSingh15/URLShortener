const mongoose = require('mongoose');
const validator = require('validator');

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
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "{VALUE} is not a valid email",
        },
    }
});

module.exports = mongoose.model('Url', UrlSchema);
