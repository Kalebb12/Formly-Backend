import dotenv from "dotenv";
import  sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `${process.env.APP_NAME}`,
    to,
    subject,
    html,
  };

  try {
    await sgMail.send(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
}
