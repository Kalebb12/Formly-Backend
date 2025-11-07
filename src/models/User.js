import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    subscription:{
      plan: {type:mongoose.Types.ObjectId, ref:"Plan"},
      stripeCustomerId: { type: String },
      status: { type: String, enum: ["active", "inactive", "canceled"], default: "inactive" },
      currentPeriodEnd: Date,      
    }
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