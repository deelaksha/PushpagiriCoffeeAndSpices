export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  phone?: string | null;
  role?: 'customer' | 'admin' | 'super_admin';
  createdAt: Date | any; // Firebase Timestamp
  updatedAt: Date | any;
  lastLogin?: Date | any;
  totalOrders: number;
  totalSpent: number;
  address?: Address;
  cartItems?: any[];
  wishlistItems?: any[];
}
