import mongoose, { Schema, Document, model, mongo } from "mongoose";

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: string;
  countInStock: number;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    userId: mongoose.Types.ObjectId,
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },
    description: { type: String, trim: true },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    category: { type: String, required: [true, "Category is required"] },
    countInStock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String },
    imagePublicId: { type: String },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
