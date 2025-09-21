import * as bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "../models/UserModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import QueryFeatures from "../utils/queryFeatures";
import { uploadToCloudinary } from "../config/cloudinary";
import { generateAuthResponse } from "./authController";

/**
 * Get all users with optional filtering, sorting, and pagination
 * @route GET /api/users
 * @access Private (Admin only)
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check authorization
  if (!req.user) {
    return next(new AppError("You are not authorized to access this resource!", 403));
  }

  // Create query features instance
  const features = new QueryFeatures({
    query: UserModel.find(),
    queryString: req.query,
  });

  // Apply filtering, sorting, field limiting, and pagination
  const query = features.filter().sort().limitFields().paginate().query;

  // Execute query
  const users = await query;

  // Get total count for pagination metadata
  const total = await UserModel.countDocuments(features.query.getFilter());

  if (!users.length) return next(new AppError("No users found!", 404));

  res.status(200).json({
    status: "success",
    results: users.length,
    total,
    page: Number(req.query.page) || 1,
    pages: Math.ceil(total / (Number(req.query.limit) || 10)),
    users,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  generateAuthResponse(req.user, 200, res)
});

/**
 * Update a user's data, password, or profile picture by ID
 * @route PATCH /api/users/:id
 * @access Private (User or Admin)
 */
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Check authorization: Is the user allowed to update this profile?
  const userId = req.params.id; // Get user ID from URL params
  if (!req.user || (req.user._id.toString() !== userId && req.user.role !== "admin")) {
    return next(new AppError("You are not authorized to update this user!", 403));
  }

  // 2. Allow updates only for permitted fields (name, email, password, or profile picture)
  const allowedUpdates = ["name", "email", "password", "phone"];
  const updates = Object.keys(req.body || {}).filter((field) => field !== "currentPassword"); // Exclude currentPassword from validation
  const isValidUpdate = updates.every((field) => allowedUpdates.includes(field));
  if (!isValidUpdate) {
  return next(new AppError("Only name, email, or password can be updated!", 400));
  }

  // 3. Handle password update if included
  let user = await UserModel.findById(userId).select("+password"); // Fetch user with password
  if (!user) {
    return next(new AppError("No user found with that ID!", 404));
  }

  if (req.body && req.body.password) {
    // Verify current password if updating password
    const { currentPassword, password } = req.body;
    if (!currentPassword) {
      return next(new AppError("Please provide your current password!", 400));
    }

    // Compare current password with stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new AppError("Current password is incorrect!", 401));
    }

    // Hash the new password
    req.body.password = await bcrypt.hash(password, 12);
  }

  // 4. Upload profile picture if provided
  let profilePic: string | undefined;
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file, "users");
      profilePic = result.secure_url; // Get the URL of the uploaded image
      req.body.profilePic = profilePic; // Add profilePic to the update data

    } catch (err) {
      return next(new AppError("Error uploading profile picture!", 500));
    }
  }

  // 5. Update the user data (including password or profile picture if changed)
  user = await UserModel.findByIdAndUpdate(
    userId,
    req.body, // Includes profilePic if uploaded
    {
      new: true, // Return the updated document
      runValidators: true, // Validate data against schema
    }
  );

  // 6. Return success response (exclude password and confirmPassword)
  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user: user
        ? { ...user.toObject(), password: undefined, confirmPassword: undefined }
        : null,
    },
  });
});

/**
 * Delete a user by ID
 * @route DELETE /api/users/:id
 * @access Private (User or Admin)
 */
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
  
    // 1. Check authorization: Ensure only the user or an admin can delete
    if (!req.user || (req.user._id.toString() !== userId && req.user.role !== "admin")) {
      return next(new AppError("You are not authorized to delete this user!", 403));
    }
  
    // 2. Delete the user and check if it exists
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return next(new AppError("No user found with that ID!", 404));
    }
  
    // 3. Return success response
    res.status(204).json({ // Use 204 for successful deletion with no content
      status: "success",
      message: "Deleted User Successfully"
    });
  });