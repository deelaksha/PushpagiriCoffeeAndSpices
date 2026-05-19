import { z } from "zod";

// =============================================
// CHECKOUT FORM SCHEMA
// =============================================

export const checkoutSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),

  // Shipping Address
  addressLine1: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address is too long"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please select your state"),
  pincode: z
    .string()
    .length(6, "PIN code must be exactly 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid PIN code"),
  country: z.string().default("India"),

  // Order Notes
  orderNotes: z.string().max(500, "Notes are too long").optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// =============================================
// CONTACT FORM SCHEMA
// =============================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      "Please enter a valid Indian mobile number"
    ),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// =============================================
// NEWSLETTER SCHEMA
// =============================================

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// =============================================
// WHOLESALE INQUIRY SCHEMA
// =============================================

export const wholesaleSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  businessType: z.string().min(1, "Please select your business type"),
  estimatedMonthlyOrder: z
    .string()
    .min(1, "Please select estimated monthly order"),
  productsInterested: z
    .array(z.string())
    .min(1, "Please select at least one product"),
  message: z.string().max(1000, "Message is too long").optional(),
});

export type WholesaleFormData = z.infer<typeof wholesaleSchema>;

// =============================================
// PRODUCT REVIEW SCHEMA
// =============================================

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review is too long"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// =============================================
// ADMIN PRODUCT SCHEMA
// =============================================

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.enum(["coffee", "spices", "premium-blends", "wholesale-packs"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  originalPrice: z.number().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  isOrganic: z.boolean(),
  isFeatured: z.boolean(),
  origin: z.string().min(3, "Origin must be at least 3 characters"),
});

export type ProductFormData = z.infer<typeof productSchema>;
