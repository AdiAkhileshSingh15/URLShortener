const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

exports.sendMail = async (email, originalUrl) => {
    try {
        return await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'URL Access Confirmation',
            text: `Your URL ${originalUrl} has been accessed.`
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
};
