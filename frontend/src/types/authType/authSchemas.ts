import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must not exceed 50 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .max(100, 'Email must not exceed 100 characters'),
    phone: z
      .string()
      .max(20, 'Phone must not exceed 20 number')
      .min(6, 'Min 6'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(32, 'Password must not exceed 32 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters long')
      .max(32, 'Confirm Password must not exceed 32 characters'),
  })

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must not exceed 32 characters'),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;