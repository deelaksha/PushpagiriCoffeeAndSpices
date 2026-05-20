'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '@/lib/firebase/auth';
import { getDocument } from '@/lib/firebase/firestore';
import { User as CustomUser } from '@/types/firebase';

interface AuthContextType {
  user: User | null;
  customUser: CustomUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  customUser: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch custom user data from Firestore
        const data = await getDocument<CustomUser>('users', firebaseUser.uid);
        if (data) {
          setCustomUser(data);
        } else {
          setCustomUser(null);
        }
      } else {
        setCustomUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        customUser,
        loading,
        isAdmin: customUser?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
