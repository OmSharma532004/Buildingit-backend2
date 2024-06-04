
//create a send email controller of whatever body is coming in request 

const nodemailer = require("nodemailer");
const mailSender=require('../utils/mailSender');
const dotenv = require("dotenv");
dotenv.config();


const sendMail = async (req, res) => {
    const mail=process.env.COMPANY_EMAIL;
    try{
        const {email, name, phone,message} = req.body;
        console.log(email, name, phone,message);
        if(!email || !name || !phone){
            return res.json({error:"Please fill all the fields"});
        }

        await mailSender(
			mail,
			"Demo Request from " + name,
			" Name: " + name + "<br> Email: " + email + "<br> Phone: " + phone + "<br> Message: " + message + "<br>" 
		);
        await mailSender(
            email,
            "Demo Request",
            "Thank you for your interest in our services. We will get back to you shortly."
        );
    }
    catch(error) {
        console.log(error.message);
    }
}

module.exports = sendMail;