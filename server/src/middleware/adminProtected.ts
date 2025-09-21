import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

export const restrictedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission!", 403));
    }
    next();
  };
};
