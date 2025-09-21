import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: String;
  password: string;
  confirmPassword?: string;
  role: "user" | "admin";
  profilePic?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    default: ""
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8, select: false },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    select: false,
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePic: { type: String, default: "" },
},
{
  timestamps: true
});

// 🔒 hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

// 🔑 compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
