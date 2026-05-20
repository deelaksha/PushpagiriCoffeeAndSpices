import * as admin from 'firebase-admin';
import { adminConfig } from './config';

try {
  if (!admin.apps.length) {
    if (adminConfig.projectId && adminConfig.clientEmail && adminConfig.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: adminConfig.projectId,
          clientEmail: adminConfig.clientEmail,
          privateKey: adminConfig.privateKey,
        }),
      });
    } else {
      console.warn('Firebase Admin SDK could not be initialized due to missing environment variables.');
    }
  }
} catch (error) {
  console.warn("Firebase Admin SDK failed to initialize (this is expected during build without valid keys):", error);
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminStorage = admin.apps.length ? admin.storage() : null;
