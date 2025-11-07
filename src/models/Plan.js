import mongoose from "mongoose"

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // in USD or lowest currency unit (like cents)
  currency: { type: String, default: "usd" },
  interval: { type: String, enum: ["month", "year"], default: "month" },
  features: [String],
  formLimit: Number,
  // limitResponses: Number,
  stripePriceId: String,
})

export default mongoose.model("Plan",planSchema)