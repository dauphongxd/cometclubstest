'use client';

import { useState, useEffect } from 'react';
import ClubCard from '@/components/ClubCard';
import JoinClubModal from '@/components/JoinClubModal';
import SchoolLogo from '@/components/SchoolLogo';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState(new Set());

  useEffect(() => {
    // In a real app, this would fetch from your API
    setClubs([
      {
        id: '1',
        name: 'Computer Science Club',
        description: 'For students interested in programming and technology',
        category: 'Technology'
      },
      {
        id: '2',
        name: 'Photography Club',
        description: 'Capture moments and learn photography techniques',
        category: 'Arts'
      },
      {
        id: '3',
        name: 'Debate Club',
        description: 'Develop public speaking and argumentation skills',
        category: 'Academic'
      },
      {
        id: '4',
        name: 'Environmental Society',
        description: 'Promote sustainability and environmental awareness on campus',
        category: 'Environmental'
      },
      {
        id: '5',
        name: 'Chess Club',
        description: 'Learn strategies and compete in chess tournaments',
        category: 'Games'
      },
      {
        id: '6',
        name: 'Dance Ensemble',
        description: 'Express yourself through various dance styles and performances',
        category: 'Arts'
      },
      {
        id: '7',
        name: 'Robotics Club',
        description: 'Build and program robots for competitions and projects',
        category: 'Technology'
      },
      {
        id: '8',
        name: 'Creative Writing Society',
        description: 'Share and develop your creative writing skills',
        category: 'Arts'
      },
      {
        id: '9',
        name: 'Basketball Club',
        description: 'Join our competitive basketball team and training sessions',
        category: 'Sports'
      },
      {
        id: '10',
        name: 'Science Society',
        description: 'Explore scientific discoveries and conduct experiments',
        category: 'Academic'
      },
      {
        id: '11',
        name: 'Music Band',
        description: 'Create music and perform at campus events',
        category: 'Arts'
      },
      {
        id: '12',
        name: 'Investment Club',
        description: 'Learn about financial markets and investment strategies',
        category: 'Business'
      }
    ]);
  }, []);

  // Get unique categories from clubs
  const categories = ['All', ...new Set(clubs.map(club => club.category))];

  useEffect(() => {
    // Fetch current user and their joined clubs
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          
          // Fetch joined clubs
          const joinedResponse = await fetch(`/api/clubs/joined?userId=${userData.id}`);
          if (joinedResponse.ok) {
            const joinedData = await joinedResponse.json();
            setJoinedClubs(new Set(joinedData.map(club => club.clubId)));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || club.category === selectedCategory;
    
    const matchesJoinedFilter = 
      !showJoinedOnly || !joinedClubs.has(club.id);
    
    return matchesSearch && matchesCategory && matchesJoinedFilter;
  });

  const handleJoinClick = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

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
            <button
              onClick={() => setShowJoinedOnly(!showJoinedOnly)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 font-medium ${
                showJoinedOnly
                  ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-lg'
                  : 'bg-[var(--card-background)] text-[var(--foreground)] hover:bg-[var(--hover-background)] backdrop-blur-sm border border-[var(--card-border)]'
              }`}
            >
              Show Unjoined Only
            </button>
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
              onJoinClick={() => handleJoinClick(club)}
              isJoined={joinedClubs.has(club.id)}
              currentUser={currentUser}
            />
          ))}
        </div>

        {showModal && (
          <JoinClubModal
            club={selectedClub}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}
