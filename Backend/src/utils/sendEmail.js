const nodemailer = require('nodemailer'); 

const sendWelcomeEmail = async (email) => {

    const transporter = nodemailer.createTransport({ 
        service: 'gmail',
        auth: {
            user: 'lalit.lakshmipathi@gmail.com',
            pass: 'uydn mijd uktm qsdh' // Your app password
        }
    });

    const mailOptions = {
        from: '"TravelGo" <lalit.lakshmipathi@gmail.com>',
        to: email,
        subject: 'Welcome to TravelGo!',
        text: 'Thank you for registering. Your account has been created successfully.',
        html: '<h1>Welcome!</h1><p>Thank you for registering with <b>TravelGo</b>.</p>'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to: " + email);
    } catch (error) {
        console.error("Email failed to send:", error);
    }
};

module.exports = sendWelcomeEmail;