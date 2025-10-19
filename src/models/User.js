import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type: String},
  email: {type:String, unique:true,required:true},
  passwordHash : {type: String,required: true},
  plan: {type:String,enum: ['free','pro'],default: 'free'},
  stripeCustomerId: {type: String},
  subscriptionStatus: {type: String, default: "inactive"},
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('User',userSchema)