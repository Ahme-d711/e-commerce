import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, easeOut } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useGetAllProduct } from '../server/productService';
import { useProductStore } from '../store/ProductStore';
import { useAddCart } from '../server/cartService';

const gridVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut, staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0 0 15px var(--color-ring)' },
  tap: { scale: 0.95 },
};

const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const { isLoading, error, data } = useGetAllProduct(page);
  const { products } = useProductStore();
  const items = (data?.data ?? products ?? []);
  const total = data?.total ?? items.length;
  const totalPages = Math.max(1, Math.ceil(total / 12));
  const canPrev = page > 1;
  const canNext = page < totalPages;


  const useCartMutation = useAddCart()

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Failed to load products. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Products</h1>
        <Link to="/products/create-product" className="btn btn-sm bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-[var(--radius-md)] px-3 py-2">
          Create Product
        </Link>
      </div>
      <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" variants={gridVariants} initial="hidden" animate="visible">
        {items.map((p) => (
          <motion.div key={p._id} variants={cardVariants} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/products/${p._id}`} className="block">
                <div className="aspect-[4/3] bg-[var(--color-muted)]">
                  <img
                    src={p.imageUrl || 'https://via.placeholder.com/600x450?text=Product'}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="p-4">
                <h2 className="text-base font-medium text-[var(--color-foreground)] line-clamp-1">{p.name}</h2>
                <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mt-1">{p.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[var(--color-foreground)] font-semibold">${p.price.toFixed(2)}</span>
                  <motion.div variants={textItemVariants}>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      onClick={() => useCartMutation.mutate(p._id)}
                      whileTap="tap"
                      className="btn cursor-pointer btn-primary bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] px-6 py-3 flex items-center justify-center hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] transition duration-200"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to cart
                    </motion.button>
                  </motion.div>
                </div>
              </div>
          </motion.div>
        ))}
      </motion.div>

      {items.length === 0 && (
        <div className="text-center text-[var(--color-muted-foreground)] mt-12">No products found.</div>
      )}

      {items.length > 0 && (
        <div className="flex items-center justify-between mt-8 text-[var(--color-muted-foreground)]">
          <div>
            Page {page} / {totalPages} · Total: {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
            >
              Prev
            </button>
            <button
              className="btn btn-sm px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!canNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;


