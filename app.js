const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.send('Hello World!');
})

app.post('/portfolio/sendmail', async (req, res) => {
    const {info} = req.body;

    try {
        response = await sendMail(info);
        return res.status(200).json({'message': 'Email sent successfully!'});
    }
    catch (err) {
        return res.status(500).json({'message': 'Error sending email!'});
    }
})

const sendMail = (info) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        secureConnection: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //send to client
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: info.email,
        subject: 'Thank you for contacting us!',
        text: 'Thank you for contacting us! We will get back to you as soon as possible.'
    };

    //send to us
    var mailOptions2 = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New message from ' + info.name,
        text: 'Name: ' + info.name + '\nEmail: ' + info.email + '\nMessage: ' + info.message
    };

    return transporter.sendMail(mailOptions).then(() => {
        return transporter.sendMail(mailOptions2);
    });
}

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
})