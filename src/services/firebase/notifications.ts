import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/lib/firebase";
import { NewsletterSubscription, ContactFormData, WholesaleInquiry } from "@/types";

// ── SAVE NEWSLETTER SUBSCRIPTION ──────────────────────────────────────────────
// Uses the email as the document ID so duplicate subscriptions are idempotent.
export async function saveNewsletterSubscription(
  data: NewsletterSubscription
): Promise<void> {
  const docRef = doc(db, FIREBASE_COLLECTIONS.NEWSLETTER, data.email);
  await setDoc(
    docRef,
    { ...data, subscribedAt: serverTimestamp(), active: true },
    { merge: true }
  );
}

// ── SAVE CONTACT FORM ─────────────────────────────────────────────────────────
export async function saveContactForm(data: ContactFormData): Promise<void> {
  await addDoc(collection(db, FIREBASE_COLLECTIONS.CONTACT_FORMS), {
    ...data,
    submittedAt: serverTimestamp(),
    status: "unread",
  });
}

// ── SAVE WHOLESALE INQUIRY ────────────────────────────────────────────────────
export async function saveWholesaleInquiry(
  data: WholesaleInquiry
): Promise<void> {
  await addDoc(collection(db, FIREBASE_COLLECTIONS.WHOLESALE_INQUIRIES), {
    ...data,
    submittedAt: serverTimestamp(),
    status: "new",
  });
}
