'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminAuthPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Authentication failed');
      }

      if (responseData.token) {
        localStorage.setItem('authToken', responseData.token);
        window.location.href = returnUrl;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-[var(--card-background)] p-8 rounded-xl shadow-lg border border-[var(--card-border)]">
        <div>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-[var(--muted-text)]">
            Access restricted to administrators only
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--card-border)] rounded-md focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--card-border)] rounded-md focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)]"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-md hover:opacity-90 transition-all duration-300 font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
