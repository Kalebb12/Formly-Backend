import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const pass = process.env.SMTP_PASS;
const user = process.env.SMTP_USER;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  secure: false, // true for 465, false for other ports
  auth: {
    user,
    pass,
  },
});

export default async function sendEmail(to,subject,html){
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${user}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions); 
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
}