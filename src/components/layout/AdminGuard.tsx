'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password === '2003') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setError('Incorrect password');
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-black px-4">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-xl text-center w-full max-w-sm border border-gray-100">
          <div className="w-12 h-12 bg-brand-green-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">🔒</span>
          </div>
          <h2 className="text-2xl font-playfair font-bold mb-2 text-brand-green-dark">Admin Access</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter password to manage Pushpagiri Store</p>
          
          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
          
          <div className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                required
              />
            </div>
            <Button type="submit" className="w-full bg-brand-green-dark hover:bg-brand-green-dark/90">
              Enter Dashboard
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
