import mongoose from "mongoose";

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
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Form", formSchema);