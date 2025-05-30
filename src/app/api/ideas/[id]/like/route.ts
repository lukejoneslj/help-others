import { NextRequest, NextResponse } from 'next/server';
import { getAllUserIdeas, updateUserIdeaHearts } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ideaId = parseInt(id);
    const { liked } = await request.json();

    if (isNaN(ideaId)) {
      return NextResponse.json(
        { error: 'Invalid idea ID' },
        { status: 400 }
      );
    }

    // Get current ideas to find the target idea
    const ideas = await getAllUserIdeas();
    const targetIdea = ideas.find(idea => idea.id === ideaId);

    if (!targetIdea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Update hearts count
    const newHearts = liked ? targetIdea.hearts + 1 : Math.max(0, targetIdea.hearts - 1);
    const success = await updateUserIdeaHearts(ideaId, newHearts);

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