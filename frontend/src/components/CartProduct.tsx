import React from 'react';
import { motion } from 'framer-motion';
import { useClearCart, useRemoveCartItem, useUpdateCartItem } from '../server/cartService';
import { useCartStore } from '../store/CartStore';

const containerVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
const rowVariants = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

const CartProducts: React.FC = () => {
  const { cart } = useCartStore();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();


  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {items.length === 0 ? (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-[var(--color-muted-foreground)]">
          Your cart is empty.
        </div>
      ) : (
        <div>
            <ul className="flex items-center text-sm justify-between py-3 px-4">
                    <li className='px-4 w-2/6'>Product</li>
                    <li className='px-4'>Quantity</li>
                    <li className='px-4'>Subtotal</li>
                    <li className='px-4'>Delete</li>
            </ul>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-x-auto">
            <div className="divide-y divide-[var(--color-border)] table-auto min-w-220">
                {items.map((it, idx) => (
                <motion.div key={idx} variants={rowVariants} className="p-4 gap-4">
                    <div className="col-span-6 flex items-center justify-between w-full gap-3">
                    <div className="flex w-2/6 items-center gap-3">
                    {typeof it.product !== 'string' && it.product?.imageUrl && (
                        <img
                        src={it.product.imageUrl}
                        alt={it.product.name ?? 'Product'}
                        className="w-16 h-16 object-cover rounded-md border"
                        />
                    )}
                    <div>
                        <div className="text-[var(--color-foreground)] line-clamp-1 font-medium">
                        {typeof it.product === 'string' ? it.product : (it.product?.name ?? it.product?._id)}
                        </div>
                        <div className="text-[var(--color-muted-foreground)] text-sm">Unit Price: ${it.price.toFixed(2)}</div>
                    </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                        className="btn btn-sm px-2 border rounded"
                        onClick={() => updateItem.mutate({ productId: it?.product._id, quantity: Math.max(1, it.quantity - 1) })}
                        >
                        -
                        </button>
                        <span className="min-w-[2ch] text-center">{it.quantity}</span>
                        <button
                        className="btn btn-sm px-2 border rounded"
                        onClick={() => updateItem.mutate({ productId: it?.product._id, quantity: it.quantity + 1 })}
                        >
                        +
                        </button>
                    </div>
                    <div className="text-right text-[var(--color-foreground)] font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
                    <button
                        className="btn btn-sm px-3 py-1 border rounded text-[var(--color-destructive)]"
                        onClick={() => removeItem.mutate(it?.product._id)}
                    >
                        Delete
                    </button>
                    </div>
                </motion.div>
                
                ))}
            </div>
            <div className="flex gap-12 items-center justify-between p-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-1 ">
                    <div className="text-[var(--color-muted-foreground)]">Total:</div>
                    <div className="text-[var(--color-foreground)] font-bold">${totalPrice.toFixed(2)}</div>
                </div>
                <div className="">
                <button onClick={() => clearCart.mutate()} className="btn btn-sm bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-[var(--radius-md)] px-3 py-2">
                  Clear Cart
                </button>
                </div>
            </div>
            </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartProducts;


