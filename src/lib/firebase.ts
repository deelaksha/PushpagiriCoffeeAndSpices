import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton — prevents re-init on Next.js hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const FIREBASE_COLLECTIONS = {
  PRODUCTS: "products",
  ORDERS: "orders",
  CUSTOMERS: "customers",
  REVIEWS: "reviews",
  NEWSLETTER: "newsletter",
  WHOLESALE_INQUIRIES: "wholesale_inquiries",
  CONTACT_FORMS: "contact_forms",
  INVENTORY: "inventory",
} as const;

export const FIREBASE_STORAGE_PATHS = {
  PRODUCT_IMAGES: "products/images",
  CATEGORY_IMAGES: "categories/images",
  BANNER_IMAGES: "banners",
  USER_AVATARS: "users/avatars",
} as const;
