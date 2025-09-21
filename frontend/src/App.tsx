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
import DashboardUsers from './components/DashboardUsers';
import CartPage from './pages/CartPage';
import MyOrderPage from './pages/MyOrderPage';
// import DashboardOrders from './pages/DashboardOrders';

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' },
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

const App: React.FC = () => {
  const { data, isLoading } = useCurrentUserQuery();
  const { user, setAuth } = useAuthStore();

  // Sync server user to zustand
  useEffect(() => {
    if (data && data !== user) {
      setAuth(data);
    } else if (!data) {
      setAuth(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setAuth]);
  
  return (
    <div className="min-h-[85vh] dark">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <HomePage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              !user && !isLoading ? (
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <SignupPage />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !user && !isLoading ? (
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <LoginPage />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <ProfilePage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <ProductsPage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/create-product"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <CreateProduct />
                </motion.div>
              </ProtectedRoute>
            }
          />



          <Route path="/products/:id/edit-product" element={<EditProduct />} />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <ProductDetailsPage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/products"
            element={
                  <DashboardProduct />
            }
          />

          <Route
            path="/dashboard/users"
            element={
                  <DashboardUsers />
            }
          />

          <Route
            path="/cart"
            element={
                  <CartPage />
            }
          />

          <Route
            path="/orders/my-orders"
            element={
                  <MyOrderPage />
            }
          />
{/* 
          <Route
            path="/dashboard/orders"
            element={
                  <DashboardOrders />
            }
          /> */}

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
