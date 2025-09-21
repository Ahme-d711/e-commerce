import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";
import AppError from "../utils/appError";

const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error?.issues
        ?.map(issue => issue.message)
        .join(", ") || "Invalid request data";

      return next(new AppError(errors, 400));
    }

    req.body = result.data;
    next();
  };
};

export default validateRequest;
