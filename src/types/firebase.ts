export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
  createdAt: any;
  updatedAt: any;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  featured?: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isOrganic: boolean;
  sku: string;
  badge?: string;
  origin: string;
  roastLevel?: "light" | "medium" | "dark" | "espresso";
  flavorNotes?: string[];
  highlights: string[];
  shippingInfo: string;
  rating: number;
  reviewCount: number;
  variants: any[];
  tags: string[];
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
  weightLabel?: string;

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  products: CartItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  updatedAt?: any;
}

// ── FIRESTORE CART ────────────────────────────────────────────────────────────
// Lightweight, serialisable cart item stored in Firestore under carts/{uid}.
// Separate from the in-memory CartItem (types/index.ts) which holds the full Product object.
export interface FirestoreCartItem {
  id: string;              // "{productId}-{weight}"
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  variantId: string;
  weightLabel: string;
  price: number;
  quantity: number;
}

export interface FirestoreCart {
  uid: string;
  items: FirestoreCartItem[];
  updatedAt: any;
}
