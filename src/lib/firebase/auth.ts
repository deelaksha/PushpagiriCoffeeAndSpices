import { auth } from './client';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

// Setup Google Provider
const googleProvider = new GoogleAuthProvider();
// Request additional scopes if needed (e.g. profile, email)
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const loginWithGoogle = async () => {
  // Ensure persistence is set before sign in
  await setPersistence(auth, browserLocalPersistence);
  return signInWithPopup(auth, googleProvider);
};

export const login = async (email: string, password: string) => {
  await setPersistence(auth, browserLocalPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential;
};

export const logout = async () => {
  return signOut(auth);
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  // Firebase automatically restores the session from indexedDB/localStorage based on persistence settings
  return onAuthStateChanged(auth, callback);
};
