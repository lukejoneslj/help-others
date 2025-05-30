import { NextRequest, NextResponse } from 'next/server';
import { getAllUserIdeas, createUserIdea } from '@/lib/database';

export async function GET() {
  try {
    const ideas = getAllUserIdeas();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Content must be 500 characters or less' },
        { status: 400 }
      );
    }

    const newIdea = createUserIdea(content.trim());
    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    console.error('Error creating user idea:', error);
    return NextResponse.json(
      { error: 'Failed to create user idea' },
      { status: 500 }
    );
  }
} 