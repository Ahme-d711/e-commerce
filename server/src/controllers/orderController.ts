import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import OrderModel, { IOrder } from '../models/OrderModel';
import ProductModel from '../models/ProductModel';
import UserModel from '../models/UserModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import QueryFeatures from '../utils/queryFeatures';

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return next(new AppError('Order items are required', 400));
    }

    if (!shippingAddress) {
      return next(new AppError('Shipping address is required', 400));
    }

    if (!paymentMethod) {
      return next(new AppError('Payment method is required', 400));
    }

    // Validate each order item and check stock
    for (const item of orderItems) {
      if (!mongoose.isValidObjectId(item.product)) {
        return next(new AppError('Invalid product ID format', 400));
      }

      const product = await ProductModel.findById(item.product);
      if (!product) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }

      if (product.countInStock < item.quantity) {
        return next(
          new AppError(
            `Not enough stock for product: ${product.name}. Available: ${product.countInStock}`,
            400
          )
        );
      }
    }

    // Calculate total price
    let itemsTotal = 0;
    for (const item of orderItems) {
      const product = await ProductModel.findById(item.product);
      if (product) {
        itemsTotal += product.price * item.quantity;
        // Update the item price to current product price
        item.price = product.price;
      }
    }

    const totalPrice = itemsTotal + (taxPrice || 0) + (shippingPrice || 0);

    // Create order
    const order = await OrderModel.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,
    });

    // Update product stock
    for (const item of orderItems) {
      await ProductModel.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: -item.quantity } },
        { new: true }
      );
    }

    // Populate order with product details
    const populatedOrder = await OrderModel.findById(order._id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name imageUrl price');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder,
    });
  }
);

/**
 * Get all orders
 * @route GET /api/orders
 * @access Private (Admin only)
 */
export const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin only.', 403));
    }

    const features = new QueryFeatures({
      query: OrderModel.find(),
      queryString: req.query,
    })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders = await features.query
      .populate('user', 'name email')
      .populate('orderItems.product', 'name imageUrl price');

    const total = await OrderModel.countDocuments();

    res.status(200).json({
      success: true,
      total,
      results: orders.length,
      data: orders,
    });
  }
);

/**
 * Get user's own orders
 * @route GET /api/orders/my-orders
 * @access Private
 */
export const getMyOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new QueryFeatures({
      query: OrderModel.find({ user: req.user!._id }),
      queryString: req.query,
    })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders = await features.query.populate(
      'orderItems.product',
      'name imageUrl price'
    );

    const total = await OrderModel.countDocuments({ user: req.user!._id });

    res.status(200).json({
      success: true,
      total,
      results: orders.length,
      data: orders,
    });
  }
);

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError('Invalid order ID format', 400));
    }

    const order = await OrderModel.findById(id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name imageUrl price');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Check if user can access this order (own order or admin)
    if (
      order.user._id.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      return next(new AppError('Access denied', 403));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  }
);

/**
 * Update order to paid
 * @route PATCH /api/orders/:id/pay
 * @access Private
 */
export const updateOrderToPaid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { paymentResult } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError('Invalid order ID format', 400));
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Check if user can update this order
    if (
      order.user.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      return next(new AppError('Access denied', 403));
    }

    if (order.isPaid) {
      return next(new AppError('Order is already paid', 400));
    }

    order.isPaid = true;
    order.paidAt = new Date();
    if (paymentResult) {
      order.paymentResult = paymentResult;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as paid',
      data: updatedOrder,
    });
  }
);

/**
 * Update order to delivered
 * @route PATCH /api/orders/:id/deliver
 * @access Private (Admin only)
 */
export const updateOrderToDelivered = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin only.', 403));
    }

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError('Invalid order ID format', 400));
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.isDelivered) {
      return next(new AppError('Order is already delivered', 400));
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as delivered',
      data: updatedOrder,
    });
  }
);

/**
 * Update order
 * @route PATCH /api/orders/:id
 * @access Private (Admin only)
 */
export const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin only.', 403));
    }

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError('Invalid order ID format', 400));
    }

    const allowedUpdates = [
      'shippingAddress',
      'paymentMethod',
      'taxPrice',
      'shippingPrice',
      'isPaid',
      'isDelivered',
    ];

    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValidUpdate) {
      return next(
        new AppError(
          'Only shipping address, payment method, prices, and status can be updated',
          400
        )
      );
    }

    const order = await OrderModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name imageUrl price');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  }
);

/**
 * Delete order
 * @route DELETE /api/orders/:id
 * @access Private (Admin only)
 */
export const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin only.', 403));
    }

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError('Invalid order ID format', 400));
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Restore product stock if order is deleted
    for (const item of order.orderItems) {
      await ProductModel.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: item.quantity } },
        { new: true }
      );
    }

    await OrderModel.findByIdAndDelete(id);

    res.status(204).send();
  }
);

/**
 * Get order statistics
 * @route GET /api/orders/stats
 * @access Private (Admin only)
 */
export const getOrderStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin only.', 403));
    }

    const stats = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' },
          paidOrders: {
            $sum: { $cond: ['$isPaid', 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: ['$isDelivered', 1, 0] },
          },
        },
      },
    ]);

    const monthlyStats = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          paidOrders: 0,
          deliveredOrders: 0,
        },
        monthlyStats,
      },
    });
  }
);
