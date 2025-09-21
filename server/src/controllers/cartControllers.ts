import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import CartModel from "../models/CartModel";
import ProductModel from "../models/ProductModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const recalculateTotal = (items: { quantity: number; price: number }[]) =>
  items.reduce((sum, i) => sum + i.quantity * i.price, 0);

// GET /api/cart
export const getMyCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));

  const cart = await CartModel.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "name price imageUrl",
  });
  

  res.status(200).json({
    status: "success",
    data: { cart: cart || { user: req.user._id, items: [], totalPrice: 0 } },
  });
});

// POST /api/cart/add
export const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));

  const { productId, quantity = 1 } = req.body as { productId: string; quantity?: number };
  const product = await ProductModel.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));

  let cart = await CartModel.findOne({ user: req.user._id as any });
  if (!cart) {
    cart = await CartModel.create({ user: new Types.ObjectId(req.user._id as any), items: [], totalPrice: 0 });
  }

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx > -1) {
    const existing = cart.items[idx];
    if (existing) {
      existing.quantity += quantity;
      existing.price = product.price; // keep price in sync
    }
  } else {
    cart.items.push({ product: new Types.ObjectId(product._id as any), quantity, price: product.price });
  }

  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "name price imageUrl",
  });

  res.status(200).json({ status: "success", data: { cart } });
});

// PATCH /api/cart/item/:productId
export const updateCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));

  const { productId } = req.params;
  const { quantity } = req.body as { quantity: number };
  if (typeof quantity !== "number" || quantity < 1) return next(new AppError("Invalid quantity", 400));

  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  console.log(cart);
  

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return next(new AppError("Item not in cart", 404));

  item.quantity = quantity;
  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "name price imageUrl",
  });

  res.status(200).json({ status: "success", data: { cart } });
});

// DELETE /api/cart/item/:productId
export const removeCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));
  const { productId } = req.params;

  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();

  res.status(204).json({ status: "success" });
});

// DELETE /api/cart
export const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));

  await CartModel.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], totalPrice: 0 } },
    { upsert: true }
  );

  res.status(204).json({ status: "success" });
});

