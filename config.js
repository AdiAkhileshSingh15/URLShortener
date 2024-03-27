require('dotenv').config();
module.exports = {
    mongoURI: process.env.MONGO_URI,
    email: {
        service: 'hotmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    }
};
