'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        // Clear user state from localStorage if you're using it
        localStorage.removeItem('user');
        // Force a full page refresh to clear all state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--hover-background)] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg shadow-lg py-1">
          <div className="px-4 py-2 border-b border-[var(--card-border)]">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-[var(--muted-text)]">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover-background)] text-red-500 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
