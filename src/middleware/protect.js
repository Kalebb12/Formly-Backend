import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;
    const user = await User.findById(user_id)
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Not authorized, email not verified" });
    }
    req.user_id = user_id;
    req.user_subscription = user.subscription;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(403).json({ error: "Invalid or expired token." });
  }
};
