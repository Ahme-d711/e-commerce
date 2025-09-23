// App.tsx
import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Navbar from './pages/Navbar';
import CreateProduct from './pages/CreateProduct';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { useCurrentUserQuery } from './server/userService';
import { useAuthStore } from './store/AuthStore';
import EditProduct from './pages/EditProduct';
import DashboardProduct from './pages/DashboardProduct';
import DashboardUsers from './pages/DashboardUsers';
import CartPage from './pages/CartPage';
import DashboardOrders from './pages/DashboardOrders';
import MyOrderPage from './pages/MyOrderPage';

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useCurrentUserQuery();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] dark">
        <motion.div
          className="text-[var(--color-foreground)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// Animated Page Wrapper
const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageVariants.transition}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const { data, isLoading } = useCurrentUserQuery();
  const { user, setAuth } = useAuthStore();

  // Sync server user to zustand
  useEffect(() => {
    if (data && data._id !== user?._id) {
      setAuth(data);
    } else if (!data && user) {
      setAuth(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setAuth]);

  return (
    <div className="min-h-[85vh] dark">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes (No Protection) */}
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />

          <Route
            path="/signup"
            element={
              !user && !isLoading ? (
                <AnimatedPage><SignupPage /></AnimatedPage>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !user && !isLoading ? (
                <AnimatedPage><LoginPage /></AnimatedPage>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AnimatedPage><ProfilePage /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AnimatedPage><ProductsPage /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/create-product"
            element={
              <ProtectedRoute>
                <AnimatedPage><CreateProduct /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <AnimatedPage><ProductDetailsPage /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id/edit-product"
            element={
              <ProtectedRoute>
                <AnimatedPage><EditProduct /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute>
                <AnimatedPage><DashboardProduct /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <AnimatedPage><DashboardUsers /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <AnimatedPage><CartPage /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/my-orders"
            element={
              <ProtectedRoute>
                <AnimatedPage><MyOrderPage /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute>
                <AnimatedPage><DashboardOrders /></AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-left"
        reverseOrder={false}
        toastOptions={{
          className: 'bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)]',
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
    </div>
  );
};

export default App;