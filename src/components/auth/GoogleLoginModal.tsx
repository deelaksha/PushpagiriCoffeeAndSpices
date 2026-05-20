"use client";

import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "@/lib/firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Coffee } from "lucide-react";

export function GoogleLoginModal() {
  const { isLoginModalOpen, closeLoginModal, executePendingAction } = useAuthStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await loginWithGoogle();
      toast.success("Successfully logged in!");
      // Automatically execute whatever action triggered the modal (e.g. Add to Cart)
      executePendingAction();
    } catch (error: any) {
      console.error(error);
      toast.error("Authentication failed. Please try again.");
      closeLoginModal(); // Optionally close on failure or leave open
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-2xl">
        <div className="bg-brand-green-dark p-8 text-white flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Coffee className="w-8 h-8 text-brand-green-light" />
          </div>
          <DialogTitle className="text-2xl font-playfair font-bold mb-2 text-white">Welcome to Pushpagiri</DialogTitle>
          <DialogDescription className="text-white/80">
            Sign in securely to save your cart, track orders, and experience the freshest spices and coffee.
          </DialogDescription>
        </div>
        
        <div className="p-8 bg-white flex flex-col gap-4">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={isAuthenticating}
            className="w-full h-12 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 flex items-center gap-3 shadow-sm rounded-xl"
          >
            {isAuthenticating ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="font-medium text-sm">{isAuthenticating ? "Signing in..." : "Continue with Google"}</span>
          </Button>
          
          <p className="text-xs text-center text-gray-400 mt-2">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
