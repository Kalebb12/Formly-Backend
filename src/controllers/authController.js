import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmails.js";
import { forgotPasswordTemplate } from "../templates/email.js";
import passwordResetToken from "../models/passwordResetToken.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import verificationToken from "../models/verificationToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
    });

    sendVerificationEmail(user);

    signSetToken(user._id, "7d", res);
    res.status(201).json({ message: "User registered", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    signSetToken(user._id, "7d", res);

    res.status(201).json({
      message: "User logged in",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    await passwordResetToken.deleteMany({ userId: user._id });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    await passwordResetToken.create({
      userId: user._id,
      token: hash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;
    await sendEmail(
      email,
      "Password Reset Request",
      forgotPasswordTemplate(resetURL, process.env.APP_NAME)
    );
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing password reset" });
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetTokenDoc = await passwordResetToken.findOne({
      userId: id,
      token: hashedToken,
    });
    if (!resetTokenDoc) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    user.passwordHash = hash; // hashed in pre-save;
    await user.save();
    await passwordResetToken.deleteMany({ userId: id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing password reset" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const verificationToken_ = await verificationToken.findOne({
      userId: id,
      token: hashedToken,
    });
    if (!verificationToken_) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.isVerified = true;
    await user.save();
    await verificationToken.deleteMany({ userId: id });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying email" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user_id = req.user_id;
    const user = await User.findById(user_id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user" });
  }
};

const signSetToken = (id, expiresIn, res) => {
  const token = jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    partitioned: true
  });
};
