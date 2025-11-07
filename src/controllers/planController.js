import Plan from "../models/Plan.js"

export const getPlan = async (req,res) => {
  try {
    const plans = await Plan.find({});
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting plans" });
  }
}