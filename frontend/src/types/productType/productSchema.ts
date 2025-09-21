import { z } from 'zod';

export const productRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z.number().positive('Price must be > 0'),
  category: z.string().min(1, 'Category is required'),
  countInStock: z.number().int().min(0, 'Count in stock must be >= 0'),

  image: z
    .any()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === '' ||
        (val instanceof FileList && val.length === 0) ||
        (val instanceof FileList && val[0] instanceof File),
      'Invalid file upload'
    ),
});

export type ProductInput = z.infer<typeof productRequestSchema>;
