'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/UserMenu';

export default function ClientLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <div className="relative">
        <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
          {!loading && user && <UserMenu user={user} />}
          <ThemeToggle />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
