'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ clubId: '', title: '', content: '' });
  const [clubs, setClubs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth?returnUrl=/admin');
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          if (!userData.isAdmin) {
            router.push('/dashboard');
            return;
          }
          setUser(userData);
          fetchClubs();
          fetchAnnouncements();
        } else {
          router.push('/auth?returnUrl=/admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth?returnUrl=/admin');
      }
    };

    checkAuth();
  }, [router]);

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs');
      if (response.ok) {
        const data = await response.json();
        setClubs(data);
      }
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAnnouncement),
      });

      if (response.ok) {
        setNewAnnouncement({ clubId: '', title: '', content: '' });
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 bg-[var(--card-background)] p-8 rounded-xl shadow-lg border border-[var(--card-border)]">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
            Admin Access Required
          </h1>
          <p className="text-center text-[var(--muted-text)]">
            Please sign in with admin credentials to access this page.
          </p>
          <div className="flex justify-center">
            <Link
              href="/auth?returnUrl=/admin"
              className="px-6 py-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Create Announcement Form */}
          <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Create Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Club</label>
                <select
                  value={newAnnouncement.clubId}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, clubId: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)]"
                  required
                >
                  <option value="">Select a club</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)] h-32"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Create Announcement
              </button>
            </form>
          </div>

          {/* Announcements List */}
          <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">All Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 border border-[var(--card-border)] rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{announcement.title}</h3>
                    <span className="text-sm text-[var(--muted-text)]">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[var(--muted-text)] mb-2">{announcement.content}</p>
                  <p className="text-sm font-medium">Club: {announcement.club.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
