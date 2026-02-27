import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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
    const existingSave = await prisma.save.findUnique({
      where: {
        videoId_userType_userId: {
          videoId,
          userType,
          userId,
        },
      },
    });
    if (existingSave) {
      await prisma.save.delete({
        where: { id: existingSave.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.save.create({
        data: {
          videoId,
          userType,
          userId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle save' },
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
    const save = await prisma.save.findUnique({
      where: {
        videoId_userType_userId: {
          videoId,
          userType,
          userId,
        },
      },
    });
    return NextResponse.json({ saved: !!save });
  } catch (error) {
    console.error('Get save status error:', error);
    return NextResponse.json(
      { error: 'Failed to get save status' },
      { status: 500 }
    );
  }
}
