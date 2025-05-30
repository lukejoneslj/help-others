'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatTimeAgo } from '@/lib/time';
import { Heart, MessageCircle, Share2, Sparkles, Plus, X, Send, ChevronDown, ChevronUp, Type, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ActOfService {
  id: number;
  content: string;
  created_at: string;
  hearts: number;
}

interface Comment {
  id: number;
  act_id: number;
  content: string;
  created_at: string;
}

export default function Home() {
  const [acts, setActs] = useState<ActOfService[]>([]);
  const [newAct, setNewAct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [submittingComments, setSubmittingComments] = useState<Set<number>>(new Set());
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);

  useEffect(() => {
    fetchActs();
  }, []);

  const fetchActs = async () => {
    try {
      const response = await fetch('/api/acts');
      if (response.ok) {
        const data = await response.json();
        setActs(data);
        
        // Initialize comment counts
        const counts: Record<number, number> = {};
        for (const act of data) {
          try {
            const commentsResponse = await fetch(`/api/acts/${act.id}/comments`);
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              counts[act.id] = commentsData.length;
            }
          } catch (error) {
            console.error(`Error fetching comments for act ${act.id}:`, error);
            counts[act.id] = 0;
          }
        }
        setCommentCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching acts:', error);
    }
  };

  const fetchComments = async (actId: number) => {
    try {
      const response = await fetch(`/api/acts/${actId}/comments`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(prev => ({
          ...prev,
          [actId]: commentsData
        }));
        setCommentCounts(prev => ({
          ...prev,
          [actId]: commentsData.length
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
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

  const handleCommentSubmit = async (actId: number) => {
    const commentContent = newComments[actId];
    if (!commentContent?.trim() || submittingComments.has(actId)) return;

    setSubmittingComments(prev => new Set(prev).add(actId));
    try {
      const response = await fetch(`/api/acts/${actId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (response.ok) {
        setNewComments(prev => ({
          ...prev,
          [actId]: ''
        }));
        await fetchComments(actId);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(actId);
        return newSet;
      });
    }
  };

  const toggleComments = async (actId: number) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(actId)) {
      newExpanded.delete(actId);
    } else {
      newExpanded.add(actId);
      if (!comments[actId]) {
        await fetchComments(actId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleLike = async (actId: number) => {
    const isCurrentlyLiked = likedPosts.has(actId);
    const newLikedPosts = new Set(likedPosts);
    
    if (isCurrentlyLiked) {
      newLikedPosts.delete(actId);
    } else {
      newLikedPosts.add(actId);
    }
    setLikedPosts(newLikedPosts);

    try {
      const response = await fetch(`/api/acts/${actId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked: !isCurrentlyLiked }),
      });

      if (response.ok) {
        const { hearts } = await response.json();
        setActs(acts.map(act => 
          act.id === actId ? { ...act, hearts } : act
        ));
      } else {
        // Revert on error
        setLikedPosts(likedPosts);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setLikedPosts(likedPosts);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea[data-main-textarea]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newAct.substring(start, end);
    const newText = newAct.substring(0, start) + prefix + selectedText + suffix + newAct.substring(end);
    
    setNewAct(newText);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const generateRandomAvatar = (id: number) => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-slate-500 to-slate-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-cyan-500 to-cyan-700',
      'bg-gradient-to-br from-emerald-500 to-emerald-700',
      'bg-gradient-to-br from-orange-500 to-orange-700',
      'bg-gradient-to-br from-red-500 to-red-700',
      'bg-gradient-to-br from-teal-500 to-teal-700',
    ];
    return gradients[id % gradients.length];
  };

  const generateRandomInitials = (id: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const first = letters[id % letters.length];
    const second = letters[(id * 7) % letters.length];
    return first + second;
  };

  const kindnessEmojis = ['🌟', '✨', '💫', '⭐', '🎯', '🚀', '💎', '🔥'];
  const getRandomEmoji = (id: number) => kindnessEmojis[id % kindnessEmojis.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                  Kindness Network
                </h1>
                <p className="text-xs text-slate-500">Share moments that matter</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className={`rounded-full transition-all duration-200 ${
                showForm 
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="ml-1 hidden sm:inline">
                {showForm ? 'Close' : 'Share'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Submission Form */}
        {showForm && (
          <Card className="mb-6 border-2 border-blue-100 shadow-xl bg-gradient-to-r from-blue-50 to-slate-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Share Your Story</h2>
                    <p className="text-sm text-slate-600">Tell us about an act of kindness - yours or someone else&apos;s</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowFormattingHelp(!showFormattingHelp)}
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Formatting Help */}
              {showFormattingHelp && (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Formatting Guide
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium text-blue-800">**Bold text**</div>
                      <div className="text-blue-600">Makes text <strong>bold</strong></div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-800">*Italic text*</div>
                      <div className="text-blue-600">Makes text <em>italic</em></div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-800"># Heading</div>
                      <div className="text-blue-600">Creates a big heading</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-800">- List item</div>
                      <div className="text-blue-600">Creates bullet points</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formatting Toolbar */}
              <div className="mb-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => insertFormatting('**', '**')}
                  className="text-xs"
                >
                  <strong>B</strong>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => insertFormatting('*', '*')}
                  className="text-xs italic"
                >
                  I
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => insertFormatting('# ')}
                  className="text-xs"
                >
                  H1
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => insertFormatting('- ')}
                  className="text-xs"
                >
                  List
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  data-main-textarea
                  value={newAct}
                  onChange={(e) => setNewAct(e.target.value)}
                  placeholder="Today, I witnessed/experienced an amazing act of kindness...

**Try using formatting!** You can make text *italic* or **bold**, create lists:
- First amazing thing
- Second wonderful thing

# Big moments deserve big headings!

Share your story in detail! ✨"
                  className="min-h-[200px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400 font-mono text-sm"
                  maxLength={3000}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    {newAct.length}/3000 characters
                  </span>
                  <Button 
                    type="submit" 
                    disabled={!newAct.trim() || isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full px-6"
                  >
                    {isSubmitting ? '✨ Sharing...' : '🚀 Share Story'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Bar */}
        {acts.length > 0 && (
          <div className="mb-6 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200">
            <div className="flex justify-center items-center space-x-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{acts.length}</div>
                <div className="text-xs text-slate-600">Stories Shared</div>
              </div>
              <div className="w-px h-8 bg-slate-300"></div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {acts.reduce((sum, act) => sum + act.hearts, 0)}
                </div>
                <div className="text-xs text-slate-600">Hearts Given</div>
              </div>
              <div className="w-px h-8 bg-slate-300"></div>
              <div>
                <div className="text-2xl font-bold text-cyan-600">
                  {Object.values(commentCounts).reduce((sum, count) => sum + count, 0)}
                </div>
                <div className="text-xs text-slate-600">Comments</div>
              </div>
            </div>
          </div>
        )}

        {/* Acts Feed */}
        <div className="space-y-4">
          {acts.map((act) => (
            <Card key={act.id} className="border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${generateRandomAvatar(act.id)}`}>
                    {generateRandomInitials(act.id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-slate-900">Anonymous {getRandomEmoji(act.id)}</div>
                    </div>
                    <div className="text-sm text-slate-500">{formatTimeAgo(act.created_at)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-800 leading-relaxed mb-4 prose prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 prose-em:text-slate-700 prose-ul:text-slate-800 prose-li:text-slate-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {act.content}
                  </ReactMarkdown>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(act.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                        likedPosts.has(act.id)
                          ? 'bg-red-100 text-red-600'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${likedPosts.has(act.id) ? 'fill-current' : ''}`} 
                      />
                      <span className="text-sm font-medium">{act.hearts}</span>
                    </button>
                    
                    <button 
                      onClick={() => toggleComments(act.id)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all duration-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{commentCounts[act.id] || 0}</span>
                      {expandedComments.has(act.id) ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  
                  <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(act.id) && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {/* Comment Input */}
                    <div className="mb-4">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          ME
                        </div>
                        <div className="flex-1">
                          <Textarea
                            value={newComments[act.id] || ''}
                            onChange={(e) => setNewComments(prev => ({
                              ...prev,
                              [act.id]: e.target.value
                            }))}
                            placeholder="Share your thoughts on this act of kindness... (You can use *formatting* too!)"
                            className="min-h-[80px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                            maxLength={1000}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500">
                              {(newComments[act.id] || '').length}/1000
                            </span>
                            <Button
                              onClick={() => handleCommentSubmit(act.id)}
                              disabled={!newComments[act.id]?.trim() || submittingComments.has(act.id)}
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full"
                            >
                              {submittingComments.has(act.id) ? (
                                '✨ Posting...'
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-1" />
                                  Comment
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {comments[act.id]?.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${generateRandomAvatar(comment.id)}`}>
                            {generateRandomInitials(comment.id)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-2xl px-3 py-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm text-gray-900">Anonymous</span>
                                <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                              </div>
                              <div className="text-gray-800 text-sm prose prose-sm max-w-none prose-strong:text-gray-900 prose-em:text-gray-700">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {comment.content}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {comments[act.id]?.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Be the first to comment on this act of kindness! 💝
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {acts.length === 0 && (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Start the Kindness Wave</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Be the first to share a story of kindness and inspire others to spread positivity!
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🚀 Share First Story
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40 md:hidden"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
