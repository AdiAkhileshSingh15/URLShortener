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

exports.sendMail = async (email, subject, text) => {
    try {
        return await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
};
