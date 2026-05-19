/**
 * Firebase Newsletter & Contact Services — Placeholder
 *
 * TODO: Uncomment and implement when Firebase is connected.
 */

import { NewsletterSubscription, ContactFormData } from "@/types";

// ── SAVE NEWSLETTER SUBSCRIPTION ─────────────
export async function saveNewsletterSubscription(
  data: NewsletterSubscription
): Promise<void> {
  // TODO: Replace with Firestore write
  // const docRef = doc(db, "newsletter", data.email);
  // await setDoc(docRef, { ...data, subscribedAt: serverTimestamp() }, { merge: true });
  console.log("TODO: saveNewsletterSubscription — Firebase not connected", data);
}

// ── SAVE CONTACT FORM ─────────────────────────
export async function saveContactForm(data: ContactFormData): Promise<void> {
  // TODO: Replace with Firestore write
  // await addDoc(collection(db, "contact_forms"), {
  //   ...data,
  //   submittedAt: serverTimestamp(),
  //   status: "unread",
  // });
  console.log("TODO: saveContactForm — Firebase not connected", data);
}

// ── SAVE WHOLESALE INQUIRY ────────────────────
export async function saveWholesaleInquiry(data: unknown): Promise<void> {
  // TODO: Replace with Firestore write
  // await addDoc(collection(db, "wholesale_inquiries"), {
  //   ...data,
  //   submittedAt: serverTimestamp(),
  //   status: "new",
  // });
  console.log("TODO: saveWholesaleInquiry — Firebase not connected", data);
}
