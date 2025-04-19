
import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than zero"),
  stock: z.number().int().min(0, "Quantity cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  image: z.string().min(1, "Please upload a product image"),
  colors: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  modelFile: z.string().optional(),
  dimensions: z.object({
    width: z.number().min(0, "Width cannot be negative"),
    height: z.number().min(0, "Height cannot be negative"),
    depth: z.number().min(0, "Length cannot be negative")
  })
});

export type ProductFormValues = z.infer<typeof productSchema>;
