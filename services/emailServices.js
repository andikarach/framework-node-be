const nodemailer = require('nodemailer');

exports.sendEmailVerification = async (receiptEmail) => {

    try {
        // Konfigurasi Nodemailer (contoh pakai Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword' // App password jika pakai Gmail
            }
        });

        // Opsi email
        const mailOptions = {
            from: 'youremail@gmail.com',
            to: receiptEmail,
            subject: 'Verifikasi Email Anda',
            text: `Klik tautan berikut untuk verifikasi: http://yourapp.com/verify?token=${verificationToken}`
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
        console.log('Email verifikasi berhasil dikirim.');
    } catch (error) {
        console.error('Gagal mengirim email verifikasi:', error);
    }
}



