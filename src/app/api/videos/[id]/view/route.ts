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
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentView = await prisma.view.findFirst({
      where: {
        videoId,
        createdAt: { gte: fiveMinutesAgo },
        OR: [
          ...(userId ? [{ userType, userId }] : []),
          { ipAddress },
        ],
      },
    });
    if (!recentView) {
      await prisma.$transaction([
        prisma.view.create({
          data: {
            videoId,
            userType,
            userId,
            ipAddress,
          },
        }),
        prisma.video.update({
          where: { id: videoId },
          data: { views: { increment: 1 } },
        }),
      ]);
      trackEngagement('view', videoId, undefined, userType || 'anonymous', userId || ipAddress);
    }
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { views: true },
    });
    return NextResponse.json({ 
      success: true, 
      views: video?.views || 0,
    });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
