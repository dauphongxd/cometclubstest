'use client';
import { useRouter } from 'next/navigation';

export default function ClubCard({ club, onJoinClick, isJoined, currentUser }) {
  const router = useRouter();
  
  const handleJoinClick = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking join button
    
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    try {
      const endpoint = isJoined ? '/api/unjoin-club' : '/api/join-club';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clubId: club.id,
          userId: currentUser.id
        })
      });

      const data = await response.json();

      if (data.error === 'Already joined this club') {
        alert('You have already joined this club!');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isJoined ? 'leave' : 'join'} club`);
      }

      // Call onJoinClick after successful join/leave
      if (onJoinClick) {
        onJoinClick();
      }
    } catch (error) {
      if (error.message !== 'Already joined this club') {
        console.error(`Failed to ${isJoined ? 'unjoin' : 'join'} club:`, error);
        alert(error.message || `Failed to ${isJoined ? 'unjoin' : 'join'} club. Please try again.`);
      }
    }
  };

  const handleCardClick = () => {
    router.push(`/clubs/${club.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--card-border)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-full cursor-pointer"
    >
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">{club.name}</h3>
        <p className="text-[var(--muted-text)] mb-6 text-sm leading-relaxed">{club.description}</p>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-1)]/10 text-[var(--accent-1)]">
          {club.category}
        </span>
        <button
          onClick={handleJoinClick}
          className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap ${
            isJoined 
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white hover:opacity-90'
          }`}
        >
          {isJoined ? (
            <>
              Leave Club
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </>
          ) : (
            <>
              Join Club
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
