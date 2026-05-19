/**
 * Firebase Configuration Placeholder
 *
 * TODO: Replace these placeholder values with actual Firebase project credentials.
 * Steps to integrate:
 * 1. Create a project at https://console.firebase.google.com
 * 2. Register your web app and copy the config object
 * 3. Replace the values below with your actual config
 * 4. Uncomment the initialization code
 * 5. Install: npm install firebase
 */

// TODO: Replace with actual Firebase config
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

// TODO: Uncomment when Firebase is integrated
// import { initializeApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const auth = getAuth(app);
// export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Placeholder exports for type safety
export const db = null; // TODO: Replace with getFirestore(app)
export const storage = null; // TODO: Replace with getStorage(app)
export const auth = null; // TODO: Replace with getAuth(app)

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
