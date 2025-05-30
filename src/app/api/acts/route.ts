import { NextRequest, NextResponse } from 'next/server';
import { getAllActs, createAct } from '@/lib/database';

export async function GET() {
  try {
    const acts = await getAllActs();
    return NextResponse.json(acts);
  } catch (error) {
    console.error('Error fetching acts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch acts' },
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

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Content must be 1000 characters or less' },
        { status: 400 }
      );
    }

    const newAct = await createAct(content.trim());
    return NextResponse.json(newAct, { status: 201 });
  } catch (error) {
    console.error('Error creating act:', error);
    return NextResponse.json(
      { error: 'Failed to create act' },
      { status: 500 }
    );
  }
} 