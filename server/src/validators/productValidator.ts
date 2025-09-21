import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number({ message: "Price must be a number" }).min(0, { message: "Price must be >= 0" })
  ),
  category: z.string().nonempty({ message: "Category is required" }),
  countInStock: z.preprocess(
    (val) => (val === undefined ? 0 : Number(val)),
    z.number().min(0, { message: "Count in stock must be >= 0" }).optional()
  ),
});
