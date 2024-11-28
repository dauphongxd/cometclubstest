'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth?returnUrl=/chat');
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
          router.push('/auth?returnUrl=/chat');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth?returnUrl=/chat');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (selectedClub) {
      fetchMessages();
      
      // Initialize Pusher
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });

      const channel = pusher.subscribe(`club-${selectedClub.id}`);
      channel.bind('new-message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [selectedClub]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchJoinedClubs = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/clubs/joined?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClubs(data);
        if (data.length > 0) {
          setSelectedClub(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch joined clubs:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/chat/${selectedClub.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClub || !user) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          clubId: selectedClub.id,
          userId: user.id,
        }),
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
          Club Chat
        </h1>

        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Club List */}
          <div className="col-span-1 bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Your Clubs</h2>
            <div className="space-y-2">
              {clubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedClub?.id === club.id
                      ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white'
                      : 'hover:bg-[var(--hover-background)]'
                  }`}
                >
                  {club.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-3 bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-4 flex flex-col">
            {selectedClub ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-[var(--card-border)] pb-4 mb-4">
                  <h2 className="text-xl font-semibold">{selectedClub.name}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.member.userId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.member.userId === user?.id
                            ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white'
                            : 'bg-[var(--hover-background)]'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {message.member.user.name}
                        </p>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--accent-1)] focus:border-transparent bg-[var(--card-background)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--muted-text)]">
                Select a club to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
