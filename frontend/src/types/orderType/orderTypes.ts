export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "card" | "cash" | "cod" | "paypal";

export interface OrderProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
  price: number; // unit price at time of order
}

export interface ShippingAddress {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name?: string; email?: string }; // can be populated
  orderItems: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  total: number;
  results: number;
  data: Order[];
}

export interface CreateOrderRequest {
  orderItems: Array<{ product: string; quantity: number }>;
  paymentMethod?: PaymentMethod;
  shippingAddress?: ShippingAddress;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  shippingAddress?: ShippingAddress;
  isPaid?: boolean;
  isDelivered?: boolean;
}


