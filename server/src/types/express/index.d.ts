import { IUser } from "../../models/UserModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
