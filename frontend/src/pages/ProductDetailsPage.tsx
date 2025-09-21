import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, easeOut, easeInOut } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Edit } from 'lucide-react';
import { useGetProduct } from '../server/productService';
import { useAddCart } from '../server/cartService';
import { useAuthStore } from '../store/AuthStore';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0 0 15px var(--color-ring)' },
  tap: { scale: 0.95 },
};

const thumbnailVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [-2, 2, -2],
    transition: {
      y: { repeat: Infinity, duration: 2, ease: easeInOut },
      rotate: { repeat: Infinity, duration: 3, ease: easeInOut },
    },
  },
};

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProduct(id);
  const { user } = useAuthStore();
  const addCart = useAddCart()

  console.log('====================================');
  console.log(product);
  console.log(product?.name);
  console.log('====================================');


  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-[var(--color-foreground)]"
        >
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)] dark">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 text-[var(--color-destructive)]">
          Failed to load product.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 h-[88vh] sm:px-6 lg:px-8 py-8 bg-[var(--color-background)] dark">
      <Link
        to="/products"
        className="inline-flex items-center text-[var(--color-muted-foreground)] mb-6 hover:text-[var(--color-foreground)] transition duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to products
      </Link>
      <motion.div
        className="grid gap-8 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Product Image */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] h-[70vh] overflow-hidden">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/800x600?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Product Details and Thumbnails */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{product.name}</h1>
            <p className="text-[var(--color-muted-foreground)]">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-[var(--color-foreground)]">
                ${product?.price?.toFixed(2)}
              </span>
              <span className="text-xs px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                {product.category}
              </span>
            </div>
            <div className="text-[var(--color-muted-foreground)]">In stock: {product.countInStock}</div>
            <div className="flex gap-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => addCart.mutate(product._id)}
                className="btn cursor-pointer btn-primary bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] px-6 py-3 flex items-center justify-center hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] transition duration-200"
                >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to cart
              </motion.button>
              {product.userId && user?._id === product?.userId &&
              <Link to={`/products/${product._id}/edit-product`}>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn cursor-pointer btn-primary bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] px-6 py-3 flex items-center justify-center hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] transition duration-200"
                  >
                  <Edit className="w-5 h-5 mr-2" /> Edit Product
                </motion.button>
                </Link>
                  }
              </div>
          </div>

          {/* Thumbnails Section with Animation */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-[var(--color-foreground)] mb-4">
              Suggested Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.img
                src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Smartphone"
                className="w-60 h-60 object-contain rounded-[var(--radius-lg)]"
                variants={thumbnailVariants}
                animate="animate"
              />
              <motion.img
                src="https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Headphones"
                className="w-60 h-60 object-contain rounded-[var(--radius-lg)]"
                variants={thumbnailVariants}
                animate="animate"
                transition={{ delay: 0.2 }}
              />
              <motion.img
                src="https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Smartwatch"
                className="w-60 h-60 object-contain rounded-[var(--radius-lg)]"
                variants={thumbnailVariants}
                animate="animate"
                transition={{ delay: 0.4 }}
              />
              <motion.img
                src="https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"
                alt="Laptop"
                className="w-60 h-60 object-contain rounded-[var(--radius-lg)]"
                variants={thumbnailVariants}
                animate="animate"
                transition={{ delay: 0.6 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsPage;