// seed/plansSeeder.js
import dotenv from "dotenv";
import { connectDB } from '../config/db.js';
import Plan from "../models/Plan.js";

dotenv.config();

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Up to 3 forms",
      "Up to 100 responses/month",
      "Basic analytics",
      "Community support",
    ],
    formLimit: 3,
  },
  {
    name: "Pro",
    price: 19,
    currency: "usd",
    features: [
      "Unlimited forms",
      "10,000 responses/month",
      "Advanced analytics",
      "Priority email support",
    ],
    formLimit: 100,
    stripePriceId:"price_1SQr1AA2OcJwZbE3jREod42C"
  },
  // {
  //   name: "Enterprise",
  //   price: 99,
  //   features: [
  //     "Unlimited forms & responses",
  //     "Team collaboration",
  //     "Custom branding",
  //     "Dedicated support",
  //   ],
  //   formLimit: 0, // 0 = unlimited
  // },
];

const seedPlans = async () => {
  try {
    await connectDB();

    for (const plan of plans) {
      await Plan.findOneAndUpdate({ name: plan.name }, plan, { upsert: true });
    }

    console.log("🌱 Plans seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    process.exit(1);
  }
};

seedPlans();
