import { z } from 'zod';

export const paymentMethodSchema = z.enum(['card', 'cash', 'cod', 'paypal']);

export const orderStatusSchema = z.enum([
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

export const orderItemSchema = z.object({
  product: z.string().min(1, 'product is required'),
  quantity: z.number().int().positive('quantity must be > 0'),
});

export const shippingAddressSchema = z.object({
  address: z.string().min(1).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// Form schema: items are supplied from cart, not user inputs → make optional
export const createOrderSchema = z.object({
  orderItems: z.array(orderItemSchema).min(1, 'At least one item is required').optional(),
  paymentMethod: paymentMethodSchema.optional(),
  shippingAddress: shippingAddressSchema.optional(),
  taxPrice: z.string().optional(),
  shippingPrice: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  paymentMethod: paymentMethodSchema.optional(),
  shippingAddress: shippingAddressSchema.optional(),
  isPaid: z.boolean().optional(),
  isDelivered: z.boolean().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;


