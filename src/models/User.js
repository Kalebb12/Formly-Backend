import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    subscription: {
      plan: {
        type: mongoose.Types.ObjectId,
        default: "690e09033c5ca7840e385e08",
        ref: "Plan",
      },
      stripeCustomerId: { type: String },
      status: {
        type: String,
        enum: ["active", "inactive", "canceled","past_due"],
        default: "inactive",
      },
      currentPeriodEnd: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash;
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
