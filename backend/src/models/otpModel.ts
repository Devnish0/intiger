import mongoose, { type Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import type { IOtp } from "../types.js";

interface IOtpMethods {
  isOtpCorrect(otp: string): Promise<boolean>;
}

type OtpModel = Model<IOtp, {}, IOtpMethods>;

const otpSchema = new Schema<IOtp, OtpModel, IOtpMethods>({
  email: String,
  otpHash: String,
  otpExpires: Number,
  otpAttempts: Number,
  signupData: {
    name: String,
    username: String,
    email: String,
    password: String,
    bio: String,
    location: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Auto-delete after 10 minutes
  },
});

// Pre-save hook: hash OTP only
otpSchema.pre("save", async function () {
  if (this.isModified("otpHash")) {
    this.otpHash = await bcrypt.hash(this.otpHash, 10);
  }
});

// Compare plain OTP with hashed OTP
otpSchema.methods.isOtpCorrect = async function (
  otp: string
): Promise<boolean> {
  return await bcrypt.compare(otp, this.otpHash);
};

export const otpModel = mongoose.model<IOtp, OtpModel>("OTP", otpSchema);
