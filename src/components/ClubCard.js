export default function ClubCard({ club, onJoinClick }) {
  return (
    <div className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--card-border)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">{club.name}</h3>
        <p className="text-[var(--muted-text)] mb-6 text-sm leading-relaxed">{club.description}</p>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-1)]/10 text-[var(--accent-1)]">
          {club.category}
        </span>
        <button
          onClick={() => onJoinClick(club)}
          className="bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          Join Club
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
