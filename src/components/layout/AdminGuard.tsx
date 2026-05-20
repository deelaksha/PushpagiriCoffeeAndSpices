'use client';

import { useState, useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2003') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fa] text-black">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl text-center w-80">
          <h2 className="text-2xl font-bold mb-6">Admin Access</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 mb-6 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            autoFocus
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded w-full hover:bg-blue-700 font-medium">
            Enter Dashboard
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
