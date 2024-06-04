const nodemailer = require("nodemailer");

const mailSender = async (email, title, body, retries = 5) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "omsharma532004@gmail.com",
      pass: "rjvzraqvizjjarxw", // Consider using an App Password
    },
    tls: {
      rejectUnauthorized: false,
    },
    socketTimeout: 5000, // 5 seconds
    connectionTimeout: 10000, // 10 seconds
  });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      let info = await transporter.sendMail({
        from: 'BuildingIt <omsharma532004@gmail.com>',
        to: `${email}`,
        subject: `${title}`,
        html: `${body}`,
      });
      console.log(info);
      return info;
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000)); // Exponential backoff
      } else {
        console.log('All attempts to send email failed.');
      }
    }
  }
}

module.exports = mailSender;
