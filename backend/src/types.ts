import type { Document, Types } from "mongoose";

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  bio: string;
  location?: string;
  isAdmin: boolean;
  posts: Types.ObjectId[];
  pfp?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

// ─── Post ────────────────────────────────────────────────────────────────────

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  data: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

export interface IOtpSignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  location?: string;
}

export interface IOtp extends Document {
  email: string;
  otpHash: string;
  otpExpires: number;
  otpAttempts: number;
  signupData: IOtpSignupData;
  createdAt: Date;
  isOtpCorrect(otp: string): Promise<boolean>;
}

// ─── Express augmentation ────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
