import { IProduct } from "../models/ProductModel";
import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/ProductModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import {
  cloudinary,
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary";
import QueryFeatures from "../utils/queryFeatures";
import mongoose from "mongoose";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, category, countInStock } = req.body;

    const existingProduct = await ProductModel.findOne({ name });
    if (existingProduct) {
      return next(new AppError("This name already exists", 400));
    }

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (req.file) {
      const result = await uploadToCloudinary(req.file, "products");
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const product: IProduct = await ProductModel.create({
      name,
      description,
      price,
      category,
      countInStock,
      imageUrl,
      imagePublicId,
      userId: req.user?._id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  }
);

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new QueryFeatures({
      query: ProductModel.find(),
      queryString: req.query,
    })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const total = await ProductModel.countDocuments();

    res.status(200).json({
      success: true,
      total,
      results: products.length,
      data: products,
    });
  }
);

export const getProductByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError("Invalid product ID format", 400));
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError("Invalid product ID format", 400));
    }

    let updateData = { ...req.body };

    if (req.file) {
      try {
        const product = await ProductModel.findById(id);
        if (!product) return next(new AppError("Product not found", 404));

        if (product.imagePublicId) {
          await deleteFromCloudinary(product.imagePublicId);
        }

        const result = await uploadToCloudinary(req.file, "users");
        updateData.imageUrl = result.secure_url;
        updateData.imagePublicId = result.public_id;
      } catch (error: any) {
        console.log(error);
        return next(
          new AppError(error.message || "Error uploading image", 500)
        );
      }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) return next(new AppError("Product not found", 404));

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  }
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError("Invalid product ID format", 400));
    }

    const product = await ProductModel.findById(id);
    if (!product) return next(new AppError("Product not found", 404));

    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
    }

    await ProductModel.findByIdAndDelete(id);

    res.status(204).send();
  }
);
