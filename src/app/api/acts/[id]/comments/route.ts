import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByActId, createComment, getActById } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actId = parseInt(id);
    
    if (isNaN(actId)) {
      return NextResponse.json(
        { error: 'Invalid act ID' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByActId(actId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actId = parseInt(id);
    
    if (isNaN(actId)) {
      return NextResponse.json(
        { error: 'Invalid act ID' },
        { status: 400 }
      );
    }

    // Check if the act exists
    const act = await getActById(actId);
    if (!act) {
      return NextResponse.json(
        { error: 'Act not found' },
        { status: 404 }
      );
    }

    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or less' },
        { status: 400 }
      );
    }

    const newComment = await createComment(actId, content.trim());
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 