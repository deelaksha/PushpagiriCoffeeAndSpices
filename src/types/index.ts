// =============================================
// PRODUCT TYPES
// =============================================

export type ProductCategory =
  | "coffee"
  | "spices"
  | "premium-blends"
  | "wholesale-packs";

export type WeightOption = {
  weight: string;
  price: number;
  stock: number;
};

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  originalPrice?: number;
  weightOptions: WeightOption[];
  stock: number;
  sku: string;
  badge?: string;
  isFeatured: boolean;
  isOrganic: boolean;
  origin: string;
  roastLevel?: "light" | "medium" | "dark" | "espresso";
  flavorNotes?: string[];
  highlights: string[];
  shippingInfo: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// =============================================
// CART TYPES
// =============================================

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedWeight: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// =============================================
// ORDER TYPES
// =============================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  weight: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerInfo: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "whatsapp" | "cod" | "online";
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================
// CUSTOMER TYPES
// =============================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: ShippingAddress;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt?: string;
}

// =============================================
// REVIEW TYPES
// =============================================

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

// =============================================
// TESTIMONIAL TYPES
// =============================================

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  product?: string;
}

// =============================================
// FAQ TYPES
// =============================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// =============================================
// WHOLESALE TYPES
// =============================================

export interface WholesaleInquiry {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  estimatedMonthlyOrder: string;
  productsInterested: string[];
  message?: string;
}

// =============================================
// CONTACT FORM TYPES
// =============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// =============================================
// NEWSLETTER TYPES
// =============================================

export interface NewsletterSubscription {
  email: string;
  name?: string;
}

// =============================================
// ADMIN TYPES
// =============================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersGrowth: number;
  revenueGrowth: number;
  customersGrowth: number;
  pendingOrders: number;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

// =============================================
// NAVIGATION TYPES
// =============================================

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// =============================================
// FILTER TYPES
// =============================================

export interface ProductFilters {
  category?: ProductCategory | "all";
  priceRange?: [number, number];
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  search?: string;
  isOrganic?: boolean;
  inStock?: boolean;
}

// =============================================
// API RESPONSE TYPES
// =============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
