import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useSignupMutation } from '../server/authService';
import { signupSchema, type SignupFormData } from '../types/authType/authSchemas';
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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone:'',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data, {
      onSuccess: () => navigate('/'),
      onError: (error: unknown) => {
        console.error('Signup error:', error);
      },
    });
  };

  return (
    <div className="min-h-[90vh] grid bg-[var(--color-background)] lg:grid-cols-2 dark">
      {/* Left side */}
      <motion.div
        className="flex flex-col justify-center items-center p-6 sm:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                >
                  <svg className="size-6 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-foreground)] mt-2">
                Create Account
              </h1>
              <p className="text-[var(--color-muted-foreground)]">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[var(--color-foreground)]">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-[var(--color-muted-foreground)]" />
                </div>
                <input
                  type="text"
                  className="input py-2.5 input-bordered w-full pl-10 bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none transition duration-200"
                  placeholder="ahmed..."
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-[var(--color-destructive)]">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[var(--color-foreground)]">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-[var(--color-muted-foreground)]" />
                </div>
                <input
                  type="email"
                  className="input py-2.5 input-bordered w-full pl-10 bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none transition duration-200"
                  placeholder="ahmed@gmail.com"
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
                  Phone
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="size-5 text-[var(--color-muted-foreground)]" />
                </div>
                <input
                  type="text"
                  className="input py-2.5 input-bordered w-full pl-10 bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none transition duration-200"
                  placeholder="01..."
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-[var(--color-destructive)]">
                    {errors.phone.message}
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
                  <Lock className="size-5 text-[var(--color-muted-foreground)]" />
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
                    <EyeOff className="size-5 text-[var(--color-muted-foreground)]" />
                  ) : (
                    <Eye className="size-5 text-[var(--color-muted-foreground)]" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-[var(--color-destructive)]">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[var(--color-foreground)]">
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-[var(--color-muted-foreground)]" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input py-2.5 input-bordered w-full pl-10 bg-[var(--color-input)] border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none transition duration-200"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-[var(--color-muted-foreground)]" />
                  ) : (
                    <Eye className="size-5 text-[var(--color-muted-foreground)]" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-[var(--color-destructive)]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || signupMutation.isPending}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn  py-2.5 btn-primary w-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting || signupMutation.isPending ? (
                <div className="flex items-center">
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
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>

            {signupMutation.isError && (
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
                      {signupMutation.error?.message || 'An error occurred during signup'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {signupMutation.isSuccess && (
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
                      Account created successfully!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </form>

          <div className="text-center">
            <p className="text-[var(--color-muted-foreground)]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="link link-primary text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}