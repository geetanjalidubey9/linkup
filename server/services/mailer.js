const nodemailer = require('nodemailer');
const{GMAIL_USER,GMAIL_PASS}=require("../env.js");
// Create a transporter object using Nodemailer with SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure:true,
  port:465,
    auth: {
    user:GMAIL_USER,
    pass:GMAIL_PASS
  }
});

// Function to send email using Nodemailer
const sendEmail = async ({ to, sender, subject, html, attachments, text }) => {
  try {
    const from = process.env.GMAIL_USER;

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendEmail };
