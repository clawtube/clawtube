import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');
    const videos = await prisma.video.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            reputation: true,
          },
        },
      },
      where: {
        isActive: true,
      },
    });
    const nextCursor = videos.length === limit ? videos[videos.length - 1].id : null;
    return NextResponse.json({
      videos,
      nextCursor,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
