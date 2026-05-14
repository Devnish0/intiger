import type { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import type { IUser } from "../types.js";

interface JwtPayload {
  data: string;
  exp: number;
}

const protectedroute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const jwtToken = req.cookies.token as string | undefined;
  if (!jwtToken) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const data = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const user = (await userModel
      .findOne({ email: data.data })
      .populate("posts")) as IUser | null; // Populate posts here too

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }
};

export default protectedroute;
