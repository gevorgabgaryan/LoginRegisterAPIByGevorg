const nodemailer = require('nodemailer');
require("dotenv").config()
const smtpConfig={
  service: 'gmail',
   auth: {
     user: 'gevorgabgaryannode@gmail.com', // replace by your email to practice
     pass: 'Sunny95090800'
   },
 tls: {
     // do not fail on invalid certs
     rejectUnauthorized: false
 },
 debug: true, // show debug output
}
const transporter = nodemailer.createTransport(smtpConfig);
// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
       console.log(error);
  } else {
       console.log('Server is ready to take our messages');
  }
});
class MailController {

        sendMail(to,title,text=null,html=null){
      try{
         const mailOptions = {
            from: process.env.sendMailFrom,
            to:to,
            subject: title,
            text,
            html
          };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
              return error;
          }
           return info.response;
        });
      }catch(err){
        console.log(err)
        return err.message
      }

     }
    
}

module.exports=new MailController()
