import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '../types/orderType/orderTypes';

export type OrderItemProduct = {
    _id: string;
    name: string;
    imageUrl?: string;
};

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    setOrders: (orders: Order[]) => void;
    setCurrentOrder: (order: Order | null) => void;
    upsertOrder: (order: Order) => void;
    removeOrder: (orderId: string) => void;
    clear: () => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            currentOrder: null,

            setOrders: (orders) => set({ orders }),
            setCurrentOrder: (order) => set({ currentOrder: order }),

            upsertOrder: (order) => {
                const existing = get().orders;
                const idx = existing.findIndex(o => o._id === order._id);
                if (idx === -1) {
                    set({ orders: [order, ...existing] });
                } else {
                    const next = [...existing];
                    next[idx] = order;
                    set({ orders: next });
                }
                set({ currentOrder: order });
            },

            removeOrder: (orderId) => {
                set({ orders: get().orders.filter(o => o._id !== orderId) });
                if (get().currentOrder?._id === orderId) {
                    set({ currentOrder: null });
                }
            },

            clear: () => set({ orders: [], currentOrder: null }),
        }),
        { name: 'orders-storage' }
    )
);


