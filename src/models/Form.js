import mongoose from "mongoose";
import slug from "slug";
import crypto from "crypto"

const formSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  fields: [
    {
      name: String,
      label: String,
      fieldType: { type: String, enum: ["text", "email", "number", "select","radio", "checkbox"],default: "text" },
      options: [String], // For select and checkbox fields
      required: { type: Boolean, default: false },
      placeholder: String,
    }
  ], 
  isPublished : { type: Boolean, default: false },
  slug: { type: String, unique: true },
  previewUrl: { type: String },
  shareableUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
})

formSchema.index({slug : 1}, {unique: true});

formSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("title")) {
    const rawSlug = slug(this.title, { lower: true });
    const shortId = crypto.randomBytes(3).toString("hex");
    this.slug = `${rawSlug}-${shortId}`;
    this.previewUrl = `${baseUrl}/form/${rawSlug}-${shortId}/preview`; 
  }
  
  if (this.isPublished) {
    const baseUrl = process.env.CLIENT_URL;
    this.shareableUrl = `${baseUrl}/form/${this.slug}/submit`;
  }else {
    this.shareableUrl = null;
  }
  next();
});

export default mongoose.model("Form", formSchema);