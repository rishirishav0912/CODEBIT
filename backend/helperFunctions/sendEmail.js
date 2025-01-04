const nodemailer=require("nodemailer");
const {google}=require('googleapis');
const oAuth2Client=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN});
module.exports=async(email,subject,text)=>{
    try{
       
        
        const accessToken=await oAuth2Client.getAccessToken();
        
const transporter=nodemailer.createTransport({
    
    service:process.env.SERVICE,
    
    auth:{
        type:'OAuth2',
        user:process.env.USER,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
        accessToken:accessToken
    }
});
console.log(transporter);

const result=await transporter.sendMail({
    from:process.env.USER,
    to:email,
    subject:subject,
    text:text
})
console.log(result);
console.log("Email sent Successfully");
    }
    catch(error){
console.log("Email not sent ");
console.log(error);

    }



}