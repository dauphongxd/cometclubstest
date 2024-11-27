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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/clubs/joined?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch joined clubs:', response.status, response.statusText);
        setJoinedClubs([]);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        setJoinedClubs([]);
        return;
      }

      let data;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText); // Add this line for debugging
        
        if (!responseText.trim()) {
          console.error('Empty response received from server');
          setJoinedClubs([]);
          return;
        }
        
        data = JSON.parse(responseText);
        console.log('Parsed data:', data); // Add this line for debugging
      } catch (error) {
        console.error('Failed to parse response:', error.message);
        setJoinedClubs([]);
        return;
      }

      // Ensure we have an array of clubs with all required fields
      if (!Array.isArray(data)) {
        console.error('Expected array of clubs but received:', typeof data);
        setJoinedClubs([]);
        return;
      }

      // Map the clubs data to ensure it has all required fields
      const formattedClubs = data.map(club => ({
        id: club.id,
        name: club.name,
        description: club.description,
        category: club.category,
        joinedAt: club.members?.[0]?.joinedAt
      }));

      console.log('Formatted joined clubs:', formattedClubs); // Debug log
      setJoinedClubs(formattedClubs);
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
          {joinedClubs.length > 0 ? (
            <>
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
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-8">
                <button
                  onClick={() => router.push('/clubs')}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300 flex items-center gap-2"
                >
                  Browse More Clubs
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="col-span-3 text-center py-8 text-[var(--muted-text)]">
              <p className="text-lg mb-4">You haven't joined any clubs yet.</p>
              <button
                onClick={() => router.push('/clubs')}
                className="px-4 py-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Browse Clubs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
