export const restrictAccess = (req, res, next) => {
  try {
    const { user_subscription } = req;
    if (user_subscription.status ===  "inactive"|| user_subscription.status === "canceled"){
      return res.status(403).json({ message: "Pro access required" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error restricting access" });
  }
};
