"use client";

import { useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { UserProfile } from "@/types/user";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setUserProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            setUserProfile({ uid: userSnap.id, ...userSnap.data() } as UserProfile);
            
            // Optionally update lastLogin
            await setDoc(userDocRef, { 
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp() 
            }, { merge: true });
          } else {
            // Create new user profile if it doesn't exist
            const newProfile = {
              uid: user.uid,
              name: user.displayName || "Valued Customer",
              email: user.email,
              photoURL: user.photoURL,
              role: "customer",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              totalOrders: 0,
              totalSpent: 0,
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile as unknown as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserProfile, setLoading]);

  return <>{children}</>;
}
