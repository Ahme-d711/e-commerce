import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../lib/api";
import { useCartStore } from "../store/CartStore";
import type { ICartF } from "../types/cartTypes";
import toast from "react-hot-toast";

export const addToCart = async(productId: string): Promise<ICartF> => {
    const res = await api.post(`/cart/add`, {productId})

    return res.data.data.cart;
}

export const getMyCart = async(): Promise<ICartF> => {
    const res = await api.get("/cart");
    
    return res.data.data.cart
}

export const updateCartItem = async(productId: string, quantity: number): Promise<ICartF> => {
    const res = await api.patch(`/cart/item/${productId}`, { quantity });
    console.log(res.data.data.cart);
    
    return res.data.data.cart;
}

export const removeCartItem = async(productId: string): Promise<void> => {
    await api.delete(`/cart/item/${productId}`);
}

export const clearCart = async(): Promise<void> => {
    await api.delete("/cart")
}

export const useAddCart = () => {
    const { setCart } = useCartStore();
    const queryClient = useQueryClient()

    return useMutation<ICartF, Error, string, { previousCart?: ICartF }>({
        mutationFn: addToCart,

        onSuccess: (cart) => {
            setCart(cart);
            queryClient.setQueryData(["cart"], cart)
            toast.success("Item added to cart")
        },

        onError: (err, _productId, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(["cart"], context.previousCart);
                setCart(context.previousCart);
            }
            toast.error("Failed to add item to cart");
            console.error(err);
        }
          
    })

    
}

export const useGetMyCart = () => {
    const { setCart } = useCartStore();
  
    const query = useQuery<ICartF>({
      queryKey: ["cart"],
      queryFn: getMyCart,
    });

    useEffect(() => {
      if (query.data) {
        setCart(query.data);
      }
    }, [query.data, setCart]);

    return query;
  };

export const useUpdateCartItem = () => {
    const { setCart } = useCartStore();
    const queryClient = useQueryClient();

    return useMutation<ICartF, Error, { productId: string; quantity: number}>({
        mutationFn: ({ productId, quantity }) => updateCartItem(productId, quantity),
        onSuccess: (cart) => {
            setCart(cart);
            queryClient.setQueryData(["cart"], cart);
        }
    })
}

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    const { setCart } = useCartStore();

    return useMutation<void, Error, string, { previousCart?: ICartF }>({
        mutationFn: removeCartItem,
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });
            const previousCart = queryClient.getQueryData<ICartF>(["cart"]);
            if (previousCart) {
                const next = { ...previousCart, items: previousCart.items.filter(i => {
                    const id = typeof i.product === 'string' ? i.product : (i.product as { _id?: string })?._id;
                    return id !== productId;
                })};
                queryClient.setQueryData(["cart"], next);
                setCart(next);
            }
            return { previousCart };
        },
        onError: (_e, _id, ctx) => {
            if (ctx?.previousCart) {
                queryClient.setQueryData(["cart"], ctx.previousCart);
                setCart(ctx.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    })
}
  
export const useClearCart = () => {
    const queryClient = useQueryClient();
    const { setCart } = useCartStore();
  
    return useMutation<void, Error>({
      mutationFn: clearCart,
  
      onSuccess: () => {
        setCart(null);
        queryClient.setQueryData(["cart"], null);
  
        toast.success("Cart cleared successfully");
      },
  
      onError: (err) => {
        toast.error("Failed to clear cart");
        console.error("Clear cart error:", err);
      },
  
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
    });
  };
  