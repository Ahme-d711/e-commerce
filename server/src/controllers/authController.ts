import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import UserModel from "../models/UserModel";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

// 🔑 Helper function to sign JWT
const signToken = (id: string) => {
  const secret: Secret = process.env.JWT_SECRET!;
  const expiresIn: string | number = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign({ id }, secret, { expiresIn } as SignOptions);
};

// 🎯 Centralized response for auth (DRY principle)
export const generateAuthResponse = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      phone: user.phone
    },
  });
};

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  // 1️⃣ check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }


  // 3️⃣ create user
  const newUser = await UserModel.create({
    name,
    email,
    password,
    confirmPassword,
    phone,
  });

  // 4️⃣ send response
  generateAuthResponse(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 🔑 select password explicitly
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // 🔒 check if password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  // ✅ send response
  generateAuthResponse(user, 200, res);
});

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ status: "success", message: "Logged out successfully" });
};

