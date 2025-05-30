'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatTimeAgo } from '@/lib/time';

interface ActOfService {
  id: number;
  content: string;
  created_at: string;
}

export default function Home() {
  const [acts, setActs] = useState<ActOfService[]>([]);
  const [newAct, setNewAct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchActs();
  }, []);

  const fetchActs = async () => {
    try {
      const response = await fetch('/api/acts');
      if (response.ok) {
        const data = await response.json();
        setActs(data);
      }
    } catch (error) {
      console.error('Error fetching acts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAct.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/acts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newAct }),
      });

      if (response.ok) {
        setNewAct('');
        setShowForm(false);
        await fetchActs();
      }
    } catch (error) {
      console.error('Error submitting act:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomAvatar = (id: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    return colors[id % colors.length];
  };

  const generateRandomInitials = (id: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const first = letters[id % letters.length];
    const second = letters[(id * 7) % letters.length];
    return first + second;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kindness Network</h1>
              <p className="text-gray-600 text-sm">Anonymous acts of service & kindness</p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {showForm ? 'Cancel' : 'Share Kindness'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Submission Form */}
        {showForm && (
          <Card className="mb-8 border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Share Your Act of Kindness</h2>
              <p className="text-sm text-gray-600">Tell the community about something kind you did or experienced. Stay anonymous and inspire others!</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={newAct}
                  onChange={(e) => setNewAct(e.target.value)}
                  placeholder="Share your act of kindness... (e.g., 'Helped an elderly neighbor with groceries', 'Left a positive note for a coworker', 'Donated clothes to a local shelter')"
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {newAct.length}/1000 characters
                  </span>
                  <Button 
                    type="submit" 
                    disabled={!newAct.trim() || isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isSubmitting ? 'Sharing...' : 'Share Anonymously'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Acts Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acts.map((act) => (
            <Card key={act.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${generateRandomAvatar(act.id)}`}>
                    {generateRandomInitials(act.id)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Anonymous</div>
                    <div className="text-sm text-gray-500">{formatTimeAgo(act.created_at)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{act.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {acts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No acts of kindness yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your story and inspire others!</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Share the First Act of Kindness
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 border-t bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 text-sm">
            A place to share and celebrate acts of kindness, big and small. 
            <br />
            Together, we can inspire more kindness in the world. 💙
          </p>
        </div>
      </div>
    </div>
  );
} 