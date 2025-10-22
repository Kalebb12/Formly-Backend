import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

// userSchema.post("save", async function (doc, next) {
//   if (!doc.isVerified && !this.isNew) {
//     const token = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//     await verificationToken.create({
//       userId: doc._id,
//       token: hashedToken,
//       expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
//     });

//     const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&id=${doc._id}`;
//     await sendEmail(
//       doc.email,
//       "Verify Your Account",
//       verifyEmailTemplate(verifyUrl, process.env.APP_NAME)
//     );
//   }
//   next();
// });

export default mongoose.model("User", userSchema);
