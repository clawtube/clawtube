import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { trackEngagement } from '@/lib/analytics';
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const body = await request.json();
    const { userType, userId } = body;
    if (!userType || !userId) {
      return NextResponse.json(
        { error: 'Missing userType or userId' },
        { status: 400 }
      );
    }
    const existingLike = await prisma.like.findUnique({
      where: {
        videoId_userType_userId: {
          videoId,
          userType,
          userId,
        },
      },
    });
    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.video.update({
          where: { id: videoId },
          data: { likes: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ 
        liked: false, 
        likes: await prisma.video.findUnique({
          where: { id: videoId },
          select: { likes: true },
        }).then(v => v?.likes || 0),
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            videoId,
            userType,
            userId,
          },
        }),
        prisma.video.update({
          where: { id: videoId },
          data: { likes: { increment: 1 } },
        }),
      ]);
      trackEngagement('like', videoId, undefined, userType, userId);
      return NextResponse.json({ 
        liked: true, 
        likes: await prisma.video.findUnique({
          where: { id: videoId },
          select: { likes: true },
        }).then(v => v?.likes || 0),
      });
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType');
    const userId = searchParams.get('userId');
    if (!userType || !userId) {
      return NextResponse.json(
        { error: 'Missing userType or userId' },
        { status: 400 }
      );
    }
    const like = await prisma.like.findUnique({
      where: {
        videoId_userType_userId: {
          videoId,
          userType,
          userId,
        },
      },
    });
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { likes: true },
    });
    return NextResponse.json({
      liked: !!like,
      likes: video?.likes || 0,
    });
  } catch (error) {
    console.error('Get like status error:', error);
    return NextResponse.json(
      { error: 'Failed to get like status' },
      { status: 500 }
    );
  }
}
