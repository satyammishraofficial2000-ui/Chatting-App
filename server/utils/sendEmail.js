const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_PASS

    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.BREVO_EMAIL,
            to,
            subject,
            html
        });
        console.log("Email sent:", info.response);
    } catch (error) {
        console.log(
            "Email sending failed:",
            error.message
        );
    }
};

module.exports = sendEmail;