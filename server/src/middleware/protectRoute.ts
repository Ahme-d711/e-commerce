import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import AppError from "../utils/appError";

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    // 2️⃣ أو من الـ Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Not logged in!", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new AppError("User no longer exists!", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
