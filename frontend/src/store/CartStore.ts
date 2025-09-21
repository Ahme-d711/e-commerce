import {create} from 'zustand';
import type { ICartF } from '../types/cartTypes';
import { persist } from 'zustand/middleware';

interface CartState {
    cart: ICartF | null;
    setCart: (cart: ICartF | null) => void;
}

export const useCartStore = create<CartState>()(
    persist((set) => ({
        cart: null,
        setCart: (cart) => set({cart})
    }),
{
    name: "cart-storage"
})
)