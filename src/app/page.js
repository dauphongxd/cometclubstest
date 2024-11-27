import SchoolLogo from '@/components/SchoolLogo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <SchoolLogo className="w-16 h-16 sm:w-20 sm:h-20" />
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
            Comet Clubs
          </h1>
        </div>

        <p className="text-xl sm:text-2xl text-[var(--muted-text)] max-w-2xl mx-auto mb-12">
          Connect with fellow students, pursue your passions, and make lasting memories through our diverse community of university clubs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth"
            className="px-8 py-4 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Get Started
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--card-border)] shadow-md">
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
              Discover
            </h3>
            <p className="text-[var(--muted-text)]">
              Explore a wide variety of clubs and find the perfect community for your interests.
            </p>
          </div>
          
          <div className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--card-border)] shadow-md">
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
              Connect
            </h3>
            <p className="text-[var(--muted-text)]">
              Meet like-minded students and build meaningful relationships through shared activities.
            </p>
          </div>
          
          <div className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--card-border)] shadow-md">
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
              Grow
            </h3>
            <p className="text-[var(--muted-text)]">
              Develop new skills, gain leadership experience, and enhance your university journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
