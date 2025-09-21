import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

// Global Error Handling Middleware
const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  if (!err.isOperational) {
    console.error("Unexpected Error:", err);
    status = 500;
    message = "Internal Server Error";
  }

  res.status(status).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
