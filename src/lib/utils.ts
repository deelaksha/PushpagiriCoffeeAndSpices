import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price number to Indian Rupee format.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date string to a readable format.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

/**
 * Generates a WhatsApp order URL with pre-filled message.
 */
export function generateWhatsAppOrderUrl(
  phone: string,
  message: string
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Generates a WhatsApp message for a cart order.
 */
export function generateOrderWhatsAppMessage(
  items: Array<{
    name: string;
    quantity: number;
    weight: string;
    price: number;
  }>,
  customerName: string,
  address: string,
  total: number
): string {
  const itemsText = items
    .map(
      (item) =>
        `• ${item.name} (${item.weight}) x${item.quantity} = ${formatPrice(item.price)}`
    )
    .join("\n");

  return `*🌿 New Order - Pushpagiri Coffee & Spice*\n\n*Customer:* ${customerName}\n*Address:* ${address}\n\n*Order Items:*\n${itemsText}\n\n*Total Amount: ${formatPrice(total)}*\n\n_Kindly confirm this order. Thank you!_`;
}

/**
 * Truncates text to a given length.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Generates a slug from a string.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Generates a unique order number.
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PCS-${timestamp}-${random}`;
}

/**
 * Validates an Indian phone number.
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validates an Indian PIN code.
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/**
 * Debounce function for search inputs.
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Gets the appropriate badge color class based on badge text.
 */
export function getBadgeClass(badge: string): string {
  const badgeMap: Record<string, string> = {
    "Best Seller": "bg-brand-gold text-white",
    "New Arrival": "bg-brand-green-dark text-white",
    Organic: "bg-brand-green-light text-brand-green-dark",
    "Export Quality": "bg-blue-600 text-white",
    Wholesale: "bg-purple-600 text-white",
    "Gift Box": "bg-brand-brown text-white",
    Collection: "bg-indigo-600 text-white",
  };
  return badgeMap[badge] || "bg-muted text-muted-foreground";
}

/**
 * Formats a star rating to display.
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Shuffles an array (Fisher-Yates algorithm).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Checks if a given URL is a video based on common extensions or keywords.
 */
export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes(".mp4") ||
    lowerUrl.includes(".webm") ||
    lowerUrl.includes(".mov") ||
    lowerUrl.includes(".ogg") ||
    lowerUrl.includes("video")
  );
}
