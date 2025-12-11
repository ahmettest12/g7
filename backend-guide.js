
/**
 * THIS IS A SERVER-SIDE CODE EXAMPLE (Node.js / Express)
 * 
 * Install dependencies on your server:
 * npm install express nodemailer twilio cors body-parser
 */

const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// POST Route: /api/notifications/send
app.post('/api/notifications/send', async (req, res) => {
    const { type, config, recipient, message } = req.body;

    try {
        if (type === 'email') {
            await sendEmail(config, recipient, message);
        } else if (type === 'sms') {
            await sendSMS(config, recipient, message);
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        res.json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 1. Email Logic (SMTP)
async function sendEmail(config, recipient, message) {
    // Create Transporter
    let transporter;
    
    if (config.provider === 'smtp') {
        transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.port === 465, // true for 465, false for other ports
            auth: {
                user: config.username,
                pass: config.password,
            },
        });
    } else if (config.provider === 'sendgrid') {
        // Example for SendGrid (using nodemailer-sendgrid-transport or direct API)
        // Simplified for SMTP usage which SendGrid also supports
        transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: { user: 'apikey', pass: config.apiKey }
        });
    }

    // Send Mail
    await transporter.sendMail({
        from: config.fromEmail || '"System" <no-reply@system.com>',
        to: recipient.email,
        subject: message.title,
        text: message.body, // Plain text body
        // html: `<p>${message.body}</p>` // You can add HTML body support
    });
}

// 2. SMS Logic (Twilio)
async function sendSMS(config, recipient, message) {
    if (config.provider === 'twilio') {
        const client = twilio(config.accountSid, config.authToken);
        
        await client.messages.create({
            body: message.body,
            from: config.senderId, // Your Twilio number or Alpha Sender ID
            to: recipient.phone
        });
    } else {
        throw new Error('Unsupported SMS provider');
    }
}

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
