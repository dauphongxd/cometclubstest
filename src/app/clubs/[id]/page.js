'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ClubDetailsPage({ params }) {
  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const router = useRouter();
  const clubId = use(params).id;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubResponse, announcementsResponse] = await Promise.all([
          fetch(`/api/clubs/${clubId}`),
          fetch(`/api/clubs/${clubId}/announcements`)
        ]);

        if (clubResponse.ok) {
          const clubData = await clubResponse.json();
          setClub(clubData);
        }

        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          setAnnouncements(announcementsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (clubId) {
      fetchData();
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
              {user?.isAdmin && (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`/api/clubs/${clubId}/announcements`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(newAnnouncement),
                    });
                    if (response.ok) {
                      setNewAnnouncement({ title: '', content: '' });
                      const updatedAnnouncements = await fetch(`/api/clubs/${clubId}/announcements`).then(res => res.json());
                      setAnnouncements(updatedAnnouncements);
                    }
                  } catch (error) {
                    console.error('Failed to create announcement:', error);
                  }
                }} className="mb-4 space-y-2">
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement Title"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)]"
                  />
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement Content"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)] h-24"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
                  >
                    Post Announcement
                  </button>
                </form>
              )}
              {announcements.map((announcement) => (
                <div key={announcement.id} className="mb-4 last:mb-0 p-4 border border-[var(--card-border)] rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{announcement.title}</h3>
                      <p className="text-[var(--muted-text)] text-sm mt-2 whitespace-pre-wrap">{announcement.content}</p>
                      <span className="text-xs text-[var(--muted-text)] mt-2 block">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user?.isAdmin && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this announcement?')) {
                            try {
                              const token = localStorage.getItem('authToken');
                              const response = await fetch(`/api/clubs/${clubId}/announcements`, {
                                method: 'DELETE',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ announcementId: announcement.id }),
                              });
                              
                              if (response.ok) {
                                const updatedAnnouncements = announcements.filter(a => a.id !== announcement.id);
                                setAnnouncements(updatedAnnouncements);
                              }
                            } catch (error) {
                              console.error('Failed to delete announcement:', error);
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
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
