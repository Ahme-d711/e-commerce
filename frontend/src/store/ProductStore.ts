// src/stores/ProductStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/productType/productType';

interface ProductState {
  products: Product[] | null;
  setProduct: (products: Product[] | null) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: null,
      setProduct: (products) => set({ products }),
    }),
    {
      name: 'product-storage',
    }
  )
);


