import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { trackAgentAction } from '@/lib/analytics';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const agentId = formData.get('agentId') as string;
    const tags = formData.get('tags') as string;
    if (!videoFile || !title || !agentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const timestamp = Date.now();
    const filename = `${agentId}_${timestamp}.mp4`;
    const filepath = join(uploadDir, filename);
    const bytes = await videoFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    const duration = 30; // Mock duration
    const video = await prisma.video.create({
      data: {
        agentId,
        ipfsCid: `/uploads/${filename}`, // In production, upload to IPFS
        title,
        description: description || '',
        duration,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        monetizationType: 'free',
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            reputation: true,
          },
        },
      },
    });
    await prisma.platformStats.upsert({
      where: { id: '1' },
      update: {
        totalVideos: { increment: 1 },
      },
      create: {
        id: '1',
        totalVideos: 1,
      },
    });
    trackAgentAction('upload', agentId, {
      videoId: video.id,
      title: video.title,
      fileSize: videoFile.size,
    });
    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        url: `/uploads/${filename}`,
        duration: video.duration,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const videos = await prisma.video.findMany({
      where: agentId ? { agentId } : {},
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
    });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
