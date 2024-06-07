
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
        return res.json({message:"Email sent successfully",success:true});
    }
    catch(error) {
        console.log(error.message);
    }
}

module.exports = sendMail;



const sendConstructionDetails = async (req, res) => {
  try {
    const { city, area, costs, prices, totalMaterialCost, userEmail, userName } = req.body;

    if (!city || !area || !costs || !prices || !totalMaterialCost || !userEmail || !userName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const materialsDetails = Object.entries(costs).map(([category, item]) => {
      const quantity = prices[category] ? (item.price / prices[category]).toFixed(0) : 'N/A';
      return `<tr><td>${category}</td><td>${quantity}</td><td>${item.price.toFixed(2)} Rs.</td></tr>`;
    }).join('');

    const emailContent = `
      <h2>Construction Material Details for ${area} ft² in ${city}</h2>
      <h3>User Details</h3>
      <p>Name: ${userName}</p>
      <p>Email: ${userEmail}</p>
      <h3>Quantity of Materials</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantity</th>
            <th>Cost (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          ${materialsDetails}
        </tbody>
      </table>
      <h3>Total Cost: ${totalMaterialCost.toFixed(2)} Rs.</h3>
    `;

    const thankYouEmailContent = `
      <h2>Thank You, ${userName}!</h2>
      <p>Thank you for using our construction material calculator. Here are the details of your calculation:</p>
      <h3>Quantity of Materials</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantity</th>
            <th>Cost (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          ${materialsDetails}
        </tbody>
      </table>
      <p className="text-center text-lg text-gray-700">
            Disclaimer: The construction cost calculator provides an estimate based on the information provided and current market rates. Actual costs may vary due to site conditions, material availability, labor costs, and other factors. This tool should be used as a guide and not as a definitive quote. For accurate pricing, please consult a professional contractor or construction company. The website owners and developers are not responsible for any discrepancies or financial losses resulting from the use
of this calculator. </p>
      <h3>Total Cost: ${totalMaterialCost.toFixed(2)} Rs.</h3>
      <p>If you have any questions, feel free to contact us.</p>
    `;

    // Email to the company
    await mailSender(
      process.env.COMPANY_EMAIL,
      "Construction Material Details",
      emailContent
    );

    // Thank-you email to the user
    await mailSender(
      userEmail,
      "Thank You for Using Our Construction Material Calculator",
      thankYouEmailContent
    );

    return res.status(200).json({ message: "Details emailed successfully", success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = sendConstructionDetails;
