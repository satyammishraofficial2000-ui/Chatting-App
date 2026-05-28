const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];

apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, html) => {

    try {

        const data = await apiInstance.sendTransacEmail({

            sender: {

                email: 'mishrashtyam@gmail.com',

                name: 'QuickChat'

            },

            to: [

                {
                    email: to
                }

            ],

            subject,

            htmlContent: html

        });

        console.log("Email sent successfully");

        console.log(data);

    } catch (error) {

        console.log(
            "Email sending failed:",
            error.response?.body || error.message
        );

    }

};

module.exports = sendEmail;