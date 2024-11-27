'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth?returnUrl=/organization');
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
          // Here you would check if user has appropriate role
          // For now, we'll just fetch organizations
          fetchOrganizations();
        } else {
          router.push('/auth?returnUrl=/organization');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth?returnUrl=/organization');
      }
    };

    checkAuth();
  }, [router]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
          Organizations
        </h1>

        <div className="mb-6">
          <button
            onClick={() => router.push('/organization/create')}
            className="px-4 py-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Create Organization
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
              <p className="text-[var(--muted-text)] mb-4">{org.description}</p>
              <button
                onClick={() => router.push(`/organization/${org.id}`)}
                className="text-[var(--accent-1)] hover:underline"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
