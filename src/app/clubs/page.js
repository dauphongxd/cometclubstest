'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClubCard from '@/components/ClubCard';
import SchoolLogo from '@/components/SchoolLogo';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('/api/clubs');
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
        setClubs([]);
      }
    };

    fetchClubs();
  }, []);

  // Get unique categories from clubs
  const categories = ['All', ...new Set(clubs.map(club => club.category))];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setCurrentUser(null);
          setJoinedClubs(new Set());
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          await fetchJoinedClubs(userData.id);
        } else {
          setCurrentUser(null);
          setJoinedClubs(new Set());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setCurrentUser(null);
        setJoinedClubs(new Set());
      }
    };
    
    fetchUserData();
  }, []);

  const fetchJoinedClubs = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const joinedResponse = await fetch(`/api/clubs/joined?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      if (joinedResponse.ok) {
        const joinedData = await joinedResponse.json();
        console.log('Joined clubs data:', joinedData); // Debug log
        setJoinedClubs(new Set(joinedData.map(club => club.id)));
      } else {
        console.error('Failed to fetch joined clubs:', await joinedResponse.text());
      }
    } catch (error) {
      console.error('Error fetching joined clubs:', error);
    }
  };

  const handleJoinClick = async () => {
    if (currentUser) {
      await fetchJoinedClubs(currentUser.id);
    }
  };


  const filteredClubs = clubs.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || club.category === selectedCategory;
    
    const matchesJoinedFilter = !joinedClubs.has(club.id); // Filter out joined clubs
    
    return matchesSearch && matchesCategory && matchesJoinedFilter;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <SchoolLogo className="w-12 h-12 mt-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent leading-none">Comet Clubs</h1>
        </div>
        
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)] text-[var(--foreground)] backdrop-blur-sm shadow-md"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map(category => (
              <button
                key={category}
                data-testid={`category-${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-lg'
                    : 'bg-[var(--card-background)] text-[var(--foreground)] hover:bg-[var(--hover-background)] backdrop-blur-sm border border-[var(--card-border)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <ClubCard 
              key={club.id} 
              club={club} 
              onJoinClick={handleJoinClick}
              isJoined={joinedClubs.has(club.id)}
              currentUser={currentUser}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
