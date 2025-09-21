import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../lib/api';
import type { CreateOrderRequest, Order, OrderResponse, OrdersResponse, UpdateOrderRequest } from '../types/orderType/orderTypes';
import { useOrderStore } from '../store/OrderStore';
import toast from 'react-hot-toast';

export const createOrder = async(data: CreateOrderRequest): Promise<Order> => {
  const res = await api.post('/orders', data);
  return (res.data as OrderResponse).data;
}

export const getMyOrders = async(page = 1): Promise<OrdersResponse> => {
  const res = await api.get(`/orders/my-orders?page=${page}`);
  return res.data as OrdersResponse;
}

export const getOrderById = async(id: string): Promise<Order> => {
  const res = await api.get(`/orders/${id}`);
  return (res.data as OrderResponse).data;
}

export const updateOrder = async(id: string, data: UpdateOrderRequest): Promise<Order> => {
  const res = await api.patch(`/orders/${id}`, data);
  return (res.data as OrderResponse).data;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { upsertOrder } = useOrderStore();

  return useMutation<Order, Error, CreateOrderRequest>({
    mutationFn: createOrder,
    onSuccess: (order) => {
      upsertOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create order');
    }
  });
}

export const useGetMyOrders = (page = 1) => {
  const { setOrders } = useOrderStore();
  const queryClient = useQueryClient();

  const query = useQuery<OrdersResponse>({
    queryKey: ['orders', page],
    queryFn: () => getMyOrders(page),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setOrders(query.data.data);
    }
  }, [query.data, setOrders]);

  // prefetch next page
  if (query.data) {
    queryClient.prefetchQuery({
      queryKey: ['orders', page + 1],
      queryFn: () => getMyOrders(page + 1),
    });
  }

  return query;
}

export const useGetOrder = (id?: string) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export const useUpdateOrder = (id: string) => {
  const queryClient = useQueryClient();
  const { upsertOrder } = useOrderStore();

  return useMutation<Order, Error, UpdateOrderRequest>({
    mutationFn: (data) => updateOrder(id, data),
    onSuccess: (order) => {
      upsertOrder(order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order updated');
    },
  });
}

// Admin functions
export const getAllOrders = async(page = 1): Promise<OrdersResponse> => {
  const res = await api.get(`/orders?page=${page}`);
  return res.data as OrdersResponse;
}

export const getOrderStats = async() => {
  const res = await api.get('/orders/stats');
  return res.data;
}

export const useGetAllOrders = (page = 1) => {
  return useQuery<OrdersResponse>({
    queryKey: ['admin-orders', page],
    queryFn: () => getAllOrders(page),
    staleTime: 5 * 60 * 1000,
  });
}

export const useGetOrderStats = () => {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: getOrderStats,
    staleTime: 5 * 60 * 1000,
  });
}


