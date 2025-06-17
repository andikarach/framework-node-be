require("dotenv").config();
const nodemailer = require("nodemailer");

const bcrypt = require('bcrypt');
const saltRounds = 12

const encryptEmail = async (email) => {
    return await bcrypt.hash(email, saltRounds);
}

const sendEmail = async (to, code) => {
    const subject = 'Verification Email'
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // gunakan true untuk port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Andika Rachadi" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: contentEmail(`https://fe-grsn.naraspace.my.id/auth/auth1/verification?code=${code}`),
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email failed to send");
    }
};

const contentEmail = (confirmationLink) =>
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
      <h2 style="color: #333;">Dear partner,</h2>
      <p>Please click the button to complete the registration within 48 hours.</p>
      <div style="text-align: center; margin: 20px 0;"><a href="${confirmationLink}" style="background-color: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Confirm</a></div>
      <p>You can also click the link below to complete the registration:</p>
      <div style="background-color: #f4f4f4; padding: 15px; word-wrap: break-word;"><a href="${confirmationLink}" style="color: #007bff;">${confirmationLink}</a></div>
      <p>If this email was not intended for you, please ignore it. Failure to do so may result in the misuse of your email.</p>
      <p>Thank You.</p>
    </div>`;

module.exports = { sendEmail, encryptEmail };
