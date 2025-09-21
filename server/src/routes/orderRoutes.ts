import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrder,
  deleteOrder,
  getOrderStats,
} from '../controllers/orderController';
import { protect } from '../middleware/protectRoute';
import { restrictedTo } from '../middleware/adminProtected';

const router = Router();

// Order statistics (Admin only)
router.get('/stats', protect, restrictedTo('admin'), getOrderStats);

// User's own orders
router.get('/my-orders', protect, getMyOrders);

// Main order routes
router
  .route('/')
  .post(protect, createOrder)
  .get(protect, restrictedTo('admin'), getAllOrders);

// Order by ID routes
router
  .route('/:id')
  .get(protect, getOrderById)
  .patch(protect, restrictedTo('admin'), updateOrder)
  .delete(protect, restrictedTo('admin'), deleteOrder);

// Order status update routes
router.patch('/:id/pay', protect, updateOrderToPaid);
router.patch('/:id/deliver', protect, restrictedTo('admin'), updateOrderToDelivered);

export default router;