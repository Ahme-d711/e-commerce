import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useLoginMutation } from '../server/authService';
import { loginSchema, type LoginFormData } from '../types/authType/authSchemas';
import AuthImagePattern from '../components/AuthImagePattern';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0 0 15px var(--color-ring)' },
  tap: { scale: 0.95 },
};

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: (error: unknown) => {
        console.error('Login error:', error);
      },
    });
  };

  return (
    <div className="min-h-[90vh] grid bg-[var(--color-background)] lg:grid-cols-2 dark">
      {/* Left Side - Form */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />

      {/* Right Side - Image/Pattern */}
      <motion.div
        className="flex flex-col justify-center items-center p-6 sm:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <motion.div
                className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                <svg
                  className="w-6 h-6 text-[var(--color-primary)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </motion.div>
              <h1 className="text-2xl font-bold text-[var(--color-foreground)] mt-2">
                Welcome Back
              </h1>
              <p className="text-[var(--color-muted-foreground)]">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[var(--color-foreground)]">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                </div>
                <input
                  type="email"
                  className="input py-2.5 input-bordered w-full pl-10 bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none transition duration-200"
                  placeholder="you@gmail.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[var(--color-destructive)]">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[var(--color-foreground)]">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input py-2.5 input-bordered w-full pl-10 bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none transition duration-200"
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-[var(--color-destructive)]">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn py-2.5 btn-primary w-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting || loginMutation.isPending ? (
                <div className="flex justify-center items-center">
                  <motion.svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-primary-foreground)]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </motion.svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </motion.button>
            {loginMutation.isError && (
              <motion.div
                className="bg-[var(--color-destructive)]/20 border border-[var(--color-destructive)] rounded-[var(--radius-md)] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-[var(--color-destructive)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-[var(--color-destructive)]">
                      {loginMutation.error?.message || 'An error occurred during login'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            {loginMutation.isSuccess && (
              <motion.div
                className="bg-[var(--color-primary)]/20 border border-[var(--color-primary)] rounded-[var(--radius-md)] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-[var(--color-primary)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-[var(--color-primary)]">
                      Login successful! Redirecting...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </form>

          <div className="text-center">
            <p className="text-[var(--color-muted-foreground)]">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="link link-primary text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition duration-200"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;