'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/UserMenu';

export default function ClientLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setUser(null);
          return;
        }
        
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        setUser(null);
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
          {!loading && (
            <>
              {user ? (
                <UserMenu user={user} />
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth"
                    className="px-4 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--card-border)] hover:bg-[var(--hover-background)] transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?register=true"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white hover:opacity-90 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              <ThemeToggle />
            </>
          )}
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
