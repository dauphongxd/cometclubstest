'use client';

import { useState } from 'react';

export default function JoinClubModal({ club, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    studentId: '',
    clubName: club.name
  });
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsJoining(true);
    try {
      const response = await fetch('/api/join-club', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join club');
      }

      setJoinStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setJoinStatus('error');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[var(--card-background)] rounded-lg p-6 max-w-md w-full backdrop-blur-sm shadow-xl border border-[var(--card-border)]">
        <h2 className="text-2xl font-bold mb-4">{club.name}</h2>
        
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[var(--card-border)] rounded-md focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[var(--card-border)] rounded-md focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--card-border)] rounded-md focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label htmlFor="studentId" className="block text-sm font-medium mb-2">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[var(--card-border)] rounded-md focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)] text-[var(--foreground)]"
            />
          </div>

          {joinStatus === 'success' && (
            <div className="p-3 bg-green-100 text-green-700 rounded">
              Successfully joined {club.name}!
            </div>
          )}
          
          {joinStatus === 'error' && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Failed to join club. Please try again.
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--card-border)] rounded-md hover:bg-[var(--hover-background)] text-[var(--foreground)]"
              disabled={isJoining}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isJoining || joinStatus === 'success'}
              className="px-4 py-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-all duration-300"
            >
              {isJoining ? 'Joining...' : 'Confirm Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
