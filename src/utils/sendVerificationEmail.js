import verificationToken from "../models/verificationToken.js";
import { verifyEmailTemplate } from "../templates/email.js";
import sendEmail from "./sendEmails.js";
import crypto from "crypto";

export const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  await verificationToken.create({
    userId: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&id=${user._id}`;
  await sendEmail(
    user.email,
    "Verify Your Account",
    verifyEmailTemplate(verifyUrl, process.env.APP_NAME)
  );
};
