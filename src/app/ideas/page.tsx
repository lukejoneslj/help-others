'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, Users, Home, MessageCircle, Gift, Coffee, Book, Smartphone, Car, Lightbulb, HandHeart, Plus, X, Send } from 'lucide-react';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/time';

interface UserIdea {
  id: number;
  content: string;
  created_at: string;
}

const ideas = [
  {
    category: "Simple Daily Acts",
    icon: <Heart className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    suggestions: [
      "Hold the door open for someone",
      "Say thank you to a service worker",
      "Give a genuine compliment",
      "Let someone go ahead of you in line",
      "Smile at a stranger",
      "Send a thoughtful text to a friend",
      "Leave a positive review for a local business",
      "Return a lost item you found"
    ]
  },
  {
    category: "Community & Neighbors",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-500",
    suggestions: [
      "Shovel snow from a neighbor's walkway",
      "Offer to pick up groceries for elderly neighbors",
      "Volunteer at a local food bank",
      "Participate in community cleanup events",
      "Help someone carry heavy items",
      "Offer your skills (tutoring, repairs, etc.)",
      "Donate clothes or household items",
      "Join or organize a neighborhood watch"
    ]
  },
  {
    category: "At Home & Family",
    icon: <Home className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    suggestions: [
      "Do an extra chore without being asked",
      "Cook a meal for someone who's stressed",
      "Listen without trying to fix their problems",
      "Offer to babysit for overwhelmed parents",
      "Help with homework or projects",
      "Share your favorite book or movie",
      "Give someone your full attention",
      "Write a heartfelt thank you note"
    ]
  },
  {
    category: "Digital Kindness",
    icon: <Smartphone className="w-6 h-6" />,
    color: "from-purple-500 to-violet-500",
    suggestions: [
      "Share someone's small business on social media",
      "Send an encouraging message to someone struggling",
      "Post something uplifting instead of complaining",
      "Help someone learn new technology",
      "Connect two people who should know each other",
      "Leave kind comments on people's posts",
      "Share helpful resources or articles",
      "Offer to help with someone's online presence"
    ]
  },
  {
    category: "Professional & Work",
    icon: <Coffee className="w-6 h-6" />,
    color: "from-orange-500 to-amber-500",
    suggestions: [
      "Bring coffee or treats for your team",
      "Offer to help a struggling colleague",
      "Share credit for successes generously",
      "Mentor someone new to your field",
      "Write a LinkedIn recommendation",
      "Introduce someone to job opportunities",
      "Help with a presentation or project",
      "Cover for someone who needs time off"
    ]
  },
  {
    category: "Random Acts of Service",
    icon: <Gift className="w-6 h-6" />,
    color: "from-cyan-500 to-teal-500",
    suggestions: [
      "Pay for someone's coffee behind you",
      "Leave quarters at a laundromat",
      "Give up your parking spot to someone circling",
      "Help someone with directions",
      "Carry someone's luggage up stairs",
      "Offer your phone charger to someone in need",
      "Help someone change a flat tire",
      "Give your umbrella to someone in the rain"
    ]
  },
  {
    category: "Learning & Growth",
    icon: <Book className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    suggestions: [
      "Teach someone a skill you know",
      "Share educational resources freely",
      "Help someone practice for an interview",
      "Offer to be a study buddy",
      "Share your professional experience",
      "Help someone with their resume",
      "Recommend books or courses",
      "Be patient with someone learning"
    ]
  },
  {
    category: "Transportation & Travel",
    icon: <Car className="w-6 h-6" />,
    color: "from-slate-500 to-gray-500",
    suggestions: [
      "Give someone a ride when they need it",
      "Help someone load/unload their car",
      "Share parking tips or good spots",
      "Let someone merge in traffic gracefully",
      "Help with directions or navigation",
      "Offer to pick up something for someone",
      "Help carry groceries to someone's car",
      "Share travel tips and recommendations"
    ]
  }
];

export default function IdeasPage() {
  const [userIdeas, setUserIdeas] = useState<UserIdea[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newIdea, setNewIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserIdeas();
  }, []);

  const fetchUserIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      if (response.ok) {
        const data = await response.json();
        setUserIdeas(data);
      }
    } catch (error) {
      console.error('Error fetching user ideas:', error);
    }
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newIdea }),
      });

      if (response.ok) {
        setNewIdea('');
        setShowSubmitForm(false);
        await fetchUserIdeas();
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBuiltInIdeas = ideas.reduce((total, category) => total + category.suggestions.length, 0);
  const totalIdeas = totalBuiltInIdeas + userIdeas.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Stories
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">
                    Ideas to Help Others
                  </h1>
                  <p className="text-xs text-slate-500">Simple ways to make someone's day better</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              size="sm"
              className={`rounded-full transition-all duration-200 ${
                showSubmitForm 
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {showSubmitForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="ml-1 hidden sm:inline">
                {showSubmitForm ? 'Close' : 'Add Idea'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Small Acts, Big Impact</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sometimes we want to help but don't know where to start. Here are simple, meaningful ways 
            to brighten someone's day and spread kindness in your community.
          </p>
        </div>

        {/* Submission Form */}
        {showSubmitForm && (
          <Card className="mb-8 border-2 border-purple-100 shadow-xl bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">✨</div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Share Your Idea</h2>
                  <p className="text-sm text-slate-600">Got a simple way to help others? Share it with the community!</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitIdea} className="space-y-4">
                <Textarea
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="Share a simple way to help others... For example: 'Leave a kind note in a library book' or 'Offer to take a photo for tourists' or 'Bring extra snacks to share at work'..."
                  className="min-h-[120px] resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    {newIdea.length}/500 characters
                  </span>
                  <Button 
                    type="submit" 
                    disabled={!newIdea.trim() || isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full px-6"
                  >
                    {isSubmitting ? '✨ Sharing...' : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Share Idea
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{ideas.length}</div>
            <div className="text-sm text-blue-800">Categories</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-3xl font-bold text-green-600">{totalIdeas}</div>
            <div className="text-sm text-green-800">Ideas to Try</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="text-3xl font-bold text-purple-600">{userIdeas.length}</div>
            <div className="text-sm text-purple-800">Community Ideas</div>
          </Card>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {ideas.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{category.category}</h3>
                    <p className="text-sm text-slate-500">{category.suggestions.length} ideas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {category.suggestions.map((suggestion, suggestionIndex) => (
                    <div 
                      key={suggestionIndex}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 group-hover:bg-slate-400 transition-colors"></div>
                      <span className="text-slate-700 text-sm leading-relaxed flex-1">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Ideas Section */}
        {userIdeas.length > 0 && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Community Ideas</h3>
                    <p className="text-sm text-slate-500">{userIdeas.length} ideas from amazing people like you</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {userIdeas.map((idea) => (
                    <div 
                      key={idea.id}
                      className="flex items-start space-x-3 p-4 rounded-lg bg-white/70 border border-purple-100 hover:bg-white/90 transition-colors group"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 group-hover:bg-purple-500 transition-colors"></div>
                      <div className="flex-1">
                        <span className="text-slate-700 text-sm leading-relaxed block mb-1">{idea.content}</span>
                        <span className="text-xs text-slate-400">Shared {formatTimeAgo(idea.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Make a Difference?</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Pick one idea that resonates with you and try it today. Then come back and share your story!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  <HandHeart className="w-5 h-5 mr-2" />
                  Share Your Story
                </Button>
              </Link>
              <Button
                onClick={() => setShowSubmitForm(true)}
                variant="outline"
                className="rounded-full px-8 py-3 text-lg border-purple-200 text-purple-600 hover:bg-purple-50 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your Idea
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Quote */}
        <div className="mt-12 text-center">
          <blockquote className="text-lg italic text-slate-600 max-w-2xl mx-auto">
            "No act of kindness, no matter how small, is ever wasted."
          </blockquote>
          <cite className="text-sm text-slate-500 mt-2 block">— Aesop</cite>
        </div>
      </div>
    </div>
  );
} 