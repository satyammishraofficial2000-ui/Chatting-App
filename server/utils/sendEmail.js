const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {

    try {

        const response = await resend.emails.send({

            from: 'QuickChat <onboarding@resend.dev>',

            to,

            subject,

            html

        });

        console.log("Email sent:", response);

    } catch (error) {

        console.log("Email sending failed:", error);

    }

};

module.exports = sendEmail;