import { create } from "zustand";
import { User } from "firebase/auth";
import { UserProfile } from "@/types/user";

interface AuthState {
  // User Session
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  
  // Login Modal State
  isLoginModalOpen: boolean;
  pendingAction: (() => void) | null;

  // Actions
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Modal Actions
  openLoginModal: (pendingAction?: () => void) => void;
  closeLoginModal: () => void;
  executePendingAction: () => void;
  clearPendingAction: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  
  isLoginModalOpen: false,
  pendingAction: null,

  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (isLoading) => set({ isLoading }),
  
  openLoginModal: (pendingAction) => set({ 
    isLoginModalOpen: true, 
    pendingAction: pendingAction || null 
  }),
  
  closeLoginModal: () => set({ 
    isLoginModalOpen: false 
  }),
  
  executePendingAction: () => {
    const action = get().pendingAction;
    if (action) {
      action();
    }
    set({ pendingAction: null, isLoginModalOpen: false });
  },

  clearPendingAction: () => set({ pendingAction: null })
}));
