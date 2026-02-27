import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { trackEngagement } from '@/lib/analytics';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const comments = await prisma.comment.findMany({
      where: { videoId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const body = await request.json();
    const { userType, userId, userName, content, parentId } = body;
    if (!userType || !userId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const comment = await prisma.comment.create({
      data: {
        videoId,
        userType,
        userId,
        userName: userName || 'Anonymous',
        content,
        parentId,
      },
    });
    trackEngagement('comment', videoId, undefined, userType, userId);
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
