const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

exports.sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: 'Welcome to Our Service Platform',
    html: `<h1>Welcome ${name}!</h1><p>Thank you for registering with us.</p>`
  };

  await transporter.sendMail(mailOptions);
};

exports.sendNotificationEmail = async (email, subject, message) => {
  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: subject,
    html: message
  };

  await transporter.sendMail(mailOptions);
};
