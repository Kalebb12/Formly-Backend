import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  form : { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: [
    {
      fieldId: { type: mongoose.Schema.Types.ObjectId, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    }
  ],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Response", responseSchema); 