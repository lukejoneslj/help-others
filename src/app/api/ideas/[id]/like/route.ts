import { NextRequest, NextResponse } from 'next/server';
import { getAllUserIdeas, updateUserIdeaHearts } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ideaId = parseInt(params.id);
    const { liked } = await request.json();

    if (isNaN(ideaId)) {
      return NextResponse.json(
        { error: 'Invalid idea ID' },
        { status: 400 }
      );
    }

    // Get current ideas to find the target idea
    const ideas = getAllUserIdeas();
    const targetIdea = ideas.find(idea => idea.id === ideaId);

    if (!targetIdea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Update hearts count
    const newHearts = liked ? targetIdea.hearts + 1 : Math.max(0, targetIdea.hearts - 1);
    const success = updateUserIdeaHearts(ideaId, newHearts);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update hearts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ hearts: newHearts });
  } catch (error) {
    console.error('Error updating idea hearts:', error);
    return NextResponse.json(
      { error: 'Failed to update hearts' },
      { status: 500 }
    );
  }
} 