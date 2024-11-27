'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClubCard from '@/components/ClubCard';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth?returnUrl=/dashboard');
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
          fetchJoinedClubs(userData.id);
        } else {
          router.push('/auth?returnUrl=/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth?returnUrl=/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  const fetchJoinedClubs = async (userId) => {
    try {
      const response = await fetch(`/api/clubs/joined?userId=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.error('Failed to fetch joined clubs:', errorData.error || 'Unknown error');
        } catch (e) {
          console.error('Failed to fetch joined clubs:', errorText || 'No response received');
        }
        setJoinedClubs([]);
        return;
      }

      let data;
      try {
        const responseText = await response.text();
        if (!responseText.trim()) {
          console.error('Empty response received from server');
          setJoinedClubs([]);
          return;
        }
        
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse response:', error.message);
        setJoinedClubs([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error('Expected array of clubs but received:', typeof data);
        setJoinedClubs([]);
        return;
      }

      setJoinedClubs(data);
    } catch (error) {
      console.error('Failed to fetch joined clubs:', error.message || error);
      setJoinedClubs([]);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
            My Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isJoined={true}
              currentUser={user}
              onJoinClick={() => {
                fetchJoinedClubs(user.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
