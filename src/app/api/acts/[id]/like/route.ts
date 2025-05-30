import { NextRequest, NextResponse } from 'next/server';
import { getActById, updateHearts } from '@/lib/database';

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

    const act = await getActById(actId);
    if (!act) {
      return NextResponse.json(
        { error: 'Act not found' },
        { status: 404 }
      );
    }

    const { liked } = await request.json();
    const newHearts = liked ? act.hearts + 1 : Math.max(0, act.hearts - 1);
    
    const success = await updateHearts(actId, newHearts);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update hearts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ hearts: newHearts });
  } catch (error) {
    console.error('Error updating hearts:', error);
    return NextResponse.json(
      { error: 'Failed to update hearts' },
      { status: 500 }
    );
  }
} 