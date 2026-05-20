/**
 * Firebase Services — Barrel Export
 *
 * Import everything from here instead of individual files:
 *   import { saveOrder, getAllProducts, ... } from "@/services/firebase";
 */

// Products
export {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  seedProductsToFirestore,
  upsertProduct,
  deleteProduct,
  updateProductStock,
} from "./products";

// Orders
export {
  saveOrder,
  getAllOrders,
  getOrdersByEmail,
  updateOrderStatus,
  updatePaymentStatus,
} from "./orders";

// Notifications / Forms
export {
  saveNewsletterSubscription,
  saveContactForm,
  saveWholesaleInquiry,
} from "./notifications";

// Customers
export {
  upsertCustomer,
  getAllCustomers,
  getCustomerByEmail,
  incrementCustomerSpend,
} from "./customers";

// Reviews
export {
  getReviewsByProduct,
  addReview,
  getAllReviews,
  verifyReview,
  deleteReview,
} from "./reviews";

// Admin / Dashboard
export { getDashboardStats } from "./admin";
