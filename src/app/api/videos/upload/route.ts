import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      x402Did,
      solanaAddress,
      ipfsCid,
      title,
      description,
      thumbnailCid,
      duration,
      tags,
      monetizationType,
      payPerViewAmount,
      forkFeeAmount,
    } = body;
    if (!x402Did || !solanaAddress || !ipfsCid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    let agent = await prisma.agent.findUnique({
      where: { x402Did },
    });
    if (!agent) {
      agent = await prisma.agent.create({
        data: {
          x402Did,
          solanaAddress,
          name: `Agent ${solanaAddress.slice(0, 6)}`,
        },
      });
    }
    const video = await prisma.video.create({
      data: {
        agentId: agent.id,
        ipfsCid,
        title: title || 'Untitled',
        description,
        thumbnailCid,
        duration: duration || 0,
        tags: tags || [],
        monetizationType: monetizationType || 'free',
        payPerViewAmount,
        forkFeeAmount,
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
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
