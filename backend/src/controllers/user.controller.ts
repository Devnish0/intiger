import type { Request, Response } from "express";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const userProfile = asyncHandler(async (req: Request, res: Response) => {
  // Populate posts when fetching user profile
  const user = await userModel.findById(req.user!._id).populate({
    path: "posts",
    options: { sort: { createdAt: -1 } },
    populate: { path: "user", select: "name username isAdmin" },
  });
  const {
    _id,
    name,
    username,
    email,
    createdAt,
    posts,
    isAdmin,
    bio,
    location,
  } = user!;
  const profile = {
    id: _id,
    name,
    username,
    email,
    createdAt,
    posts,
    isAdmin,
    bio,
    location,
  };
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: profile },
        "profile Fetched Successfully"
      )
    );
});
const editUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, bio, location } = req.body;
  const id = req.user!._id;
  const editedUser = await userModel
    .findByIdAndUpdate(
      id,
      {
        $set: { name, username, bio, location },
      },
      { new: true, runValidators: true }
    )
    .select("name username bio location");
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: editedUser }, "edit data sent succesfully")
    );
});

export { userProfile, editUserProfile };
