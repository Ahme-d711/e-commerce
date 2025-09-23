import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetMyCart } from '../server/cartService';
import CartProducts from '../components/CartProduct';
import OrderForm from '../components/Orderform';


const CartPage: React.FC = () => {
  const query = useGetMyCart();


  if (query.isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-[var(--color-foreground)]">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Failed to load your cart. Please try again.
        </div>
      </div>
    );
  }


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Your Cart</h1>
        <Link to="/products" className="btn btn-sm bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-[var(--radius-md)] px-3 py-2">
          Continue Shopping
        </Link>
      </div>
      <div className="flex gap-12 flex-col xl:flex-row">
        <div className="flex-2">
          <CartProducts />
        </div>
        <div className="mx-auto">
          <OrderForm />
        </div>
      </div>
    </div>
  );
};

export default CartPage;


