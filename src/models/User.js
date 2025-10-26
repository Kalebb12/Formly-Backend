import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    stripeCustomerId: { type: String },
    subscriptionStatus: { type: String, default: "inactive" },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export default mongoose.model("User", userSchema);