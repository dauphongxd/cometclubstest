'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ClubDetailsPage({ params }) {
  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);
  const router = useRouter();
  const clubId = use(params).id;

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`/api/clubs/${clubId}`);
        if (response.ok) {
          const data = await response.json();
          setClub(data);
          // In a real app, you would also fetch announcements and activities here
          setAnnouncements([
            { id: 1, title: 'Welcome New Members!', content: 'We are excited to have you join our club...', date: '2024-01-15' },
            { id: 2, title: 'Upcoming Event', content: 'Join us for our monthly meetup...', date: '2024-01-20' },
          ]);
          setActivities([
            { id: 1, name: 'Weekly Meeting', date: '2024-01-25', location: 'Room 101' },
            { id: 2, name: 'Workshop', date: '2024-02-01', location: 'Main Hall' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch club details:', error);
      }
    };

    if (clubId) {
      fetchClubDetails();
    }
  }, [clubId]);

  if (!club) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
          {club.name}
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--card-border)] hover:bg-[var(--hover-background)] transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
              {announcements.map((announcement) => (
                <div key={announcement.id} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-medium">{announcement.title}</h3>
                  <p className="text-[var(--muted-text)] text-sm">{announcement.content}</p>
                  <span className="text-xs text-[var(--muted-text)]">{announcement.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Activities</h2>
              {activities.map((activity) => (
                <div key={activity.id} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-medium">{activity.name}</h3>
                  <p className="text-[var(--muted-text)] text-sm">
                    {activity.date} at {activity.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
