const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID2, process.env.CLIENT_SECRET2, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN2 });

module.exports = async (email, subject, text) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        console.log("at", accessToken);
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                type: 'OAuth2',
                user: process.env.USER2,
                clientId: process.env.CLIENT_ID2,
                clientSecret: process.env.CLIENT_SECRET2,
                refreshToken: process.env.REFRESH_TOKEN2,
                accessToken: accessToken
            }
        });

        console.log(transporter);
        const result = await transporter.sendMail({ from: process.env.USER2, to: email, subject: subject, text: text })
        console.log("re", result); console.log("Email sent Successfully");
    }
    catch (error) {
        console.log("Email not sent ");
        console.log(error);
    }
}