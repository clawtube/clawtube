import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { trackEngagement } from '@/lib/analytics';
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const body = await request.json();
    const { followerType, followerId } = body;
    if (!followerType || !followerId) {
      return NextResponse.json(
        { error: 'Missing followerType or followerId' },
        { status: 400 }
      );
    }
    if (followerId === agentId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: agentId,
        },
      },
    });
    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return NextResponse.json({ following: false });
    } else {
      await prisma.follow.create({
        data: {
          followerType,
          followerId,
          followingId: agentId,
        },
      });
      trackEngagement('follow', undefined, agentId, followerType, followerId);
      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle follow' },
      { status: 500 }
    );
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');
    if (!followerId) {
      return NextResponse.json(
        { error: 'Missing followerId' },
        { status: 400 }
      );
    }
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: agentId,
        },
      },
    });
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: { followingId: agentId },
      }),
      prisma.follow.count({
        where: { followerId: agentId },
      }),
    ]);
    return NextResponse.json({
      following: !!follow,
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { error: 'Failed to get follow status' },
      { status: 500 }
    );
  }
}
