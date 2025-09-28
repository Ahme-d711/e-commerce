// src/types/express.d.ts

import { IUser } from "../models/UserModel"; // عدّل المسار حسب الحاجة

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
