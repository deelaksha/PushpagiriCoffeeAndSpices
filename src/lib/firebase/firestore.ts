import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './client';

// ---------------------------------------------------------------------------
// Helper: Normalize product data to ensure `images` is always an array.
// Legacy documents may have a single `image` string field.
// This function converts such documents to the new shape.
export const normalizeProductData = (data: any): any => {
  if (data && typeof data === 'object') {
    // If `images` is missing but `image` exists, promote it.
    if (!Array.isArray(data.images) && typeof data.image === 'string') {
      data.images = [data.image];
      delete data.image;
    }
    // Ensure `images` is always an array (even if empty).
    if (!Array.isArray(data.images)) {
      data.images = [];
    }
  }
  return data;
};

// ---------------------------------------------------------------------------
// Updated getDocument / getDocuments to apply normalization.


export const getDocument = async <T extends DocumentData>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = { id: docSnap.id, ...docSnap.data() } as unknown as T;
    // Normalize product data if needed
    return normalizeProductData(data) as T;
  }
  return null;
};

export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = ({ id: doc.id, ...doc.data() }) as unknown as T;
    return normalizeProductData(data) as T;
  });
};

// No changes needed for createDocument

export const addDocument = async <T extends DocumentData>(collectionName: string, data: any): Promise<string> => {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
};

export const updateDocument = async (collectionName: string, id: string, data: any): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
