import User from "../models/User.js";
import Form from "../models/Form.js";

export const checkFormLimit = async (req, res, next) => {
  const user = await User.findById(req.user_id).populate("subscription.plan");
  const plan = user.subscription.plan;

  const totalForms = await Form.countDocuments({ owner: user._id });

  if (totalForms >= plan.formLimit) {
    return res.status(403).json({ message: "Form limit reached. Upgrade your plan." });
  }

  next();
};